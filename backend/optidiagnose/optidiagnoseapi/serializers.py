from rest_framework import serializers
from .models import Patient, Examination, Scan, NetworkDiagnosis


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class ExaminationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examination
        exclude = ["patient"]
        optional_fields = ["notes"]


class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        exclude = ["examination"]


class NetworkDiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkDiagnosis
        exclude = ["examination"]
