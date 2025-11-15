from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Avg, Q
from django.http import HttpResponse
import csv
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment
from .models import Feedback
from .serializers import FeedbackSerializer, UserSerializer, RegisterSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return JWT tokens"""
    from django.contrib.auth import authenticate
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

    def get_permissions(self):
        """Allow anyone to create feedback, but require auth for viewing"""
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Add search, filter, and sorting"""
        queryset = Feedback.objects.all()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email__icontains=search) |
                Q(message__icontains=search)
            )
        
        # Rating filter
        rating = self.request.query_params.get('rating', None)
        if rating:
            queryset = queryset.filter(rating=rating)
        
        # Sorting
        sort_by = self.request.query_params.get('sort', None)
        if sort_by == 'latest':
            queryset = queryset.order_by('-createdAt')
        elif sort_by == 'oldest':
            queryset = queryset.order_by('createdAt')
        elif sort_by == 'highest_rating':
            queryset = queryset.order_by('-rating', '-createdAt')
        elif sort_by == 'lowest_rating':
            queryset = queryset.order_by('rating', '-createdAt')
        else:
            queryset = queryset.order_by('-createdAt')
        
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get analytics statistics"""
        queryset = Feedback.objects.all()
        
        total = queryset.count()
        avg_rating = queryset.aggregate(Avg('rating'))['rating__avg'] or 0
        positive = queryset.filter(rating__gte=4).count()
        negative = queryset.filter(rating__lt=3).count()
        
        # Rating distribution
        rating_dist = {}
        for i in range(1, 6):
            rating_dist[i] = queryset.filter(rating=i).count()
        
        return Response({
            'total': total,
            'averageRating': round(avg_rating, 2),
            'positive': positive,
            'negative': negative,
            'ratingDistribution': rating_dist,
        })

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export all feedbacks to CSV"""
        queryset = self.get_queryset()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="feedbacks.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Email', 'Message', 'Rating', 'Created At'])
        
        for feedback in queryset:
            writer.writerow([
                feedback.id,
                feedback.name,
                feedback.email,
                feedback.message,
                feedback.rating,
                feedback.createdAt.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response

    @action(detail=False, methods=['get'])
    def export_excel(self, request):
        """Export all feedbacks to Excel"""
        queryset = self.get_queryset()
        
        wb = Workbook()
        ws = wb.active
        ws.title = "Feedbacks"
        
        # Headers
        headers = ['ID', 'Name', 'Email', 'Message', 'Rating', 'Created At']
        ws.append(headers)
        
        # Style headers
        for cell in ws[1]:
            cell.font = Font(bold=True)
            cell.alignment = Alignment(horizontal='center')
        
        # Data
        for feedback in queryset:
            ws.append([
                feedback.id,
                feedback.name,
                feedback.email,
                feedback.message,
                feedback.rating,
                feedback.createdAt.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        # Auto-adjust column widths
        for column in ws.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            ws.column_dimensions[column_letter].width = adjusted_width
        
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="feedbacks.xlsx"'
        
        wb.save(response)
        return response

