from django.urls import path

from .views import (
    PatientListCreate,
    PatientDetail,
    ExaminationListCreate,
    ExaminationDetail,
    ScanListCreate,
    ScanDetail,
    NetworkDiagnosisListCreate,
    NetworkDiagnosisDetail,
)

urlpatterns = [
    path("patient/", PatientListCreate.as_view(), name="patient-list-create"),
    path("patient/<uuid:patient_id>", PatientDetail.as_view(), name="patient-detail"),
    path("examination/", ExaminationListCreate.as_view(), name="examination-list-create"),
    path("examination/<uuid:examination_id>", ExaminationDetail.as_view(), name="examination-detail"),
    path("scan/", ScanListCreate.as_view(), name="scan-list-create"),
    path("scan/<uuid:scan_id>", ScanDetail.as_view(), name="scan-detail"),
    path("network-diagnosis/", NetworkDiagnosisListCreate.as_view(), name="network-diagnosis-list-create"),
    path(
        "network-diagnosis/<uuid:network_diagnosis_id>",
        NetworkDiagnosisDetail.as_view(),
        name="network-diagnosis-detail",
    ),
]
