import json

import requests
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

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

    def perform_create(self, serializer):
        patient = get_object_or_404(Patient, pk=self.kwargs.get("patient_id"))
        serializer.save(patient=patient)

    def get_queryset(self):
        patient = get_object_or_404(Patient, pk=self.kwargs.get("patient_id"))
        return Examination.objects.filter(patient=patient)


class ExaminationDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExaminationSerializer
    queryset = Examination.objects.all()
    lookup_url_kwarg = "examination_id"


class ScanListUpload(viewsets.ModelViewSet):
    serializer_class = ScanSerializer

    def perform_create(self, serializer):
        examination = get_object_or_404(Examination, pk=self.kwargs.get("examination_id"))
        serializer.save(examination=examination)

    def get_queryset(self):
        examination = get_object_or_404(Examination, pk=self.kwargs.get("examination_id"))
        return Scan.objects.filter(examination=examination)


class ScanRetrieveDestroy(generics.RetrieveDestroyAPIView):
    serializer_class = ScanSerializer
    queryset = Scan.objects.all()
    lookup_url_kwarg = "scan_id"


class NetworkDiagnosisListCreate(APIView):
    def get(self, request, scan_id):
        scan = get_object_or_404(Scan, pk=scan_id)
        network_diagnoses = NetworkDiagnosis.objects.filter(scan=scan)
        serializer = NetworkDiagnosisSerializer(network_diagnoses, many=True)
        return Response(serializer.data)

    def post(self, request, scan_id):
        """
        Handle POST request to create a new NetworkDiagnosis for a given scan.

        This method performs the following steps:
        1. Retrieves the Scan object based on the provided scan_id.
        2. Deletes all previous NetworkDiagnosis objects associated with the scan.
        3. Sends the scan image to the PyTorch Serve for diagnosis.
        4. Creates a new NetworkDiagnosis object based on the response from the PyTorch Serve.

        Args:
            request (Request): The HTTP request object.
            scan_id (int): The ID of the scan for which the diagnosis is to be created.

        Returns:
            Response: A Response object containing the serialized NetworkDiagnosis data or an error message.
        """
        # Get the scan object
        scan = get_object_or_404(Scan, pk=scan_id)

        # Delete all previous network diagnosis for this scan
        NetworkDiagnosis.objects.filter(scan=scan).delete()

        # Send the scan to the PyTorch Serve
        with open(scan.photo.path, "rb") as scan_file:
            response = requests.post(
                "http://serve:8080/predictions/vgg",
                data=scan_file,
            )
        if response.status_code != 200:
            return Response(response.json(), status=status.HTTP_400_BAD_REQUEST)

        # Use the response to create a new NetworkDiagnosis object
        network_response = json.loads(response.text)
        for class_, confidence in network_response["probabilities"].items():
            diagnosis_data = {
                "network_name": "VGG16",
                "diagnosis": class_,
                "confidence": confidence,
            }
            serializer = NetworkDiagnosisSerializer(data=diagnosis_data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(scan=scan)

        serializer = NetworkDiagnosisSerializer(NetworkDiagnosis.objects.filter(scan=scan), many=True)
        return Response(serializer.data)


class NetworkDiagnosisRetrieve(generics.RetrieveAPIView):
    serializer_class = NetworkDiagnosisSerializer
    queryset = NetworkDiagnosis.objects.all()
    lookup_url_kwarg = "network_diagnosis_id"
