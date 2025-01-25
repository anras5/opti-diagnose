import uuid

from django.contrib.auth.models import User
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Patient, Examination, Scan, NetworkDiagnosis

NETWORKS = ["vgg16", "mobilenetv3", "vit"]
CLASSES = ["CNV", "DME", "DRUSEN", "NORMAL"]
FILENAME = "./NORMAL-76914-1.jpeg"


@override_settings(MEDIA_ROOT="optidiagnose/optidiagnoseapi/tests/assets")
class NetworkDiagnosisTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username="admin", password="admin")
        self.patient = Patient.objects.create(
            firstname="John",
            lastname="Doe",
            email="john.doe@example.com",
            birthdate="2000-01-01",
            national_id="1234567890",
        )
        self.examination = Examination.objects.create(patient=self.patient, date="2021-01-01")
        self.scan = Scan.objects.create(examination=self.examination, photo=FILENAME)
        self.tokens = self.client.post(reverse("token_obtain_pair"), {"username": "admin", "password": "admin"}).data

    def create_network_diagnosis(self, scan_id):
        url = reverse("network_diagnosis_list_create", args=[scan_id])
        return self.client.post(url, headers={"Authorization": f"Bearer {self.tokens['access']}"})

    def retrieves_network_diagnosis(self, scan_id):
        url = reverse("network_diagnosis_list_create", args=[scan_id])
        return self.client.get(url, headers={"Authorization": f"Bearer {self.tokens['access']}"})

    def retrieves_network_diagnosis_by_id(self, network_diagnosis_id):
        url = reverse("network_diagnosis_retrieve", args=[network_diagnosis_id])
        return self.client.get(url, headers={"Authorization": f"Bearer {self.tokens['access']}"})

    def test_creates_network_diagnosis_successfully(self):
        response = self.create_network_diagnosis(self.scan.id)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(NetworkDiagnosis.objects.count(), len(NETWORKS) * len(CLASSES))

    def test_retrieves_network_diagnosis_successfully(self):
        self.create_network_diagnosis(self.scan.id)
        response = self.retrieves_network_diagnosis(self.scan.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(NETWORKS) * len(CLASSES))

    def test_retrieves_network_diagnosis_by_id_successfully(self):
        self.create_network_diagnosis(self.scan.id)
        network_diagnosis = NetworkDiagnosis.objects.first()
        response = self.retrieves_network_diagnosis_by_id(network_diagnosis.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(network_diagnosis.id))

    def test_fails_to_create_network_diagnosis_with_invalid_scan_id(self):
        response = self.create_network_diagnosis(uuid.uuid4())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fails_to_retrieve_network_diagnosis_with_invalid_scan_id(self):
        response = self.retrieves_network_diagnosis(uuid.uuid4())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_fails_to_retrieve_network_diagnosis_by_invalid_id(self):
        response = self.retrieves_network_diagnosis_by_id(uuid.uuid4())
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
