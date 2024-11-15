from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import viewsets

from .models import Patient, Examination, Scan, NetworkDiagnosis
from .permissions import IsSuperUser
from .serializers import (
    PatientSerializer,
    ExaminationSerializer,
    ScanSerializer,
    NetworkDiagnosisSerializer,
    UserSerializer,
)


class UserCreate(generics.CreateAPIView):
    permission_classes = [IsSuperUser]
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

    def perform_create(self, serializer):
        patient = get_object_or_404(Patient, pk=self.kwargs.get("patient_id"))
        serializer.save(patient=patient)


class ExaminationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExaminationSerializer
    queryset = Examination.objects.all()
    lookup_url_kwarg = "examination_id"


class ScanUploadView(viewsets.ModelViewSet):
    queryset = Scan.objects.all()
    serializer_class = ScanSerializer

    def perform_create(self, serializer):
        examination = get_object_or_404(Examination, pk=self.kwargs.get("examination_id"))
        serializer.save(examination=examination)


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
