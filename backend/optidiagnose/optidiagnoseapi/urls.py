from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    PatientListCreate,
    PatientDetail,
    ExaminationListCreate,
    ExaminationDetail,
    ScanDetail,
    NetworkDiagnosisListCreate,
    NetworkDiagnosisDetail,
    UserCreate,
    ScanUploadView,
)

urlpatterns = [
    path("user/", UserCreate.as_view(), name="user_create"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("patients/", PatientListCreate.as_view(), name="patient_list_create"),
    path("patients/<uuid:patient_id>", PatientDetail.as_view(), name="patient_detail"),
    path("patients/<uuid:patient_id>/examinations/", ExaminationListCreate.as_view(), name="examination_list_create"),
    path("examinations/<uuid:examination_id>", ExaminationDetail.as_view(), name="examination_detail"),
    path("examinations/<uuid:examination_id>/scans/", ScanUploadView.as_view({'post': 'create'}), name="scan_upload"),
    path("scans/<uuid:scan_id>", ScanDetail.as_view(), name="scan_detail"),
    path("network-diagnosis/", NetworkDiagnosisListCreate.as_view(), name="network_diagnosis_list_create"),
    path(
        "network-diagnosis/<uuid:network_diagnosis_id>",
        NetworkDiagnosisDetail.as_view(),
        name="network_diagnosis_detail",
    ),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
