from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    PatientListCreate,
    PatientDetail,
    ExaminationListCreate,
    ExaminationDetail,
    ScanListCreate,
    ScanDetail,
    NetworkDiagnosisListCreate,
    NetworkDiagnosisDetail,
    UserCreate,
)

urlpatterns = [
    path("user/", UserCreate.as_view(), name="user_create"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("patient/", PatientListCreate.as_view(), name="patient_list_create"),
    path("patient/<uuid:patient_id>", PatientDetail.as_view(), name="patient_detail"),
    path("examination/", ExaminationListCreate.as_view(), name="examination_list_create"),
    path("examination/<uuid:examination_id>", ExaminationDetail.as_view(), name="examination_detail"),
    path("scan/", ScanListCreate.as_view(), name="scan_list_create"),
    path("scan/<uuid:scan_id>", ScanDetail.as_view(), name="scan_detail"),
    path("network-diagnosis/", NetworkDiagnosisListCreate.as_view(), name="network_diagnosis_list_create"),
    path(
        "network-diagnosis/<uuid:network_diagnosis_id>",
        NetworkDiagnosisDetail.as_view(),
        name="network-diagnosis-detail",
    ),
]
