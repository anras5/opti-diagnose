from django.contrib.auth.models import User
from rest_framework import generics

from .models import Patient, Examination, Scan, NetworkDiagnosis
from .serializers import (
    PatientSerializer,
    ExaminationSerializer,
    ScanSerializer,
    NetworkDiagnosisSerializer,
    UserSerializer,
)


class UserCreate(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class PatientListCreate(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()


class PatientDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    lookup_url_kwarg = "patient_id"


class ExaminationListCreate(generics.ListCreateAPIView):
    serializer_class = ExaminationSerializer
    queryset = Examination.objects.all()


class ExaminationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExaminationSerializer
    queryset = Examination.objects.all()
    lookup_url_kwarg = "examination_id"


class ScanListCreate(generics.ListCreateAPIView):
    serializer_class = ScanSerializer
    queryset = Scan.objects.all()


class ScanDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScanSerializer
    queryset = Scan.objects.all()
    lookup_url_kwarg = "scan_id"


class NetworkDiagnosisListCreate(generics.ListCreateAPIView):
    serializer_class = NetworkDiagnosisSerializer
    queryset = NetworkDiagnosis.objects.all()


class NetworkDiagnosisDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NetworkDiagnosisSerializer
    queryset = Scan.objects.all()
    lookup_url_kwarg = "network_diagnosis_id"
