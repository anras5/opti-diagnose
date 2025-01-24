from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Patient, Examination, Scan, NetworkDiagnosis


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "first_name", "last_name")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


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
        exclude = ["scan"]
