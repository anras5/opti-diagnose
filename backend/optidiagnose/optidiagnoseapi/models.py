import uuid

from django.db import models


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True  # This makes it an abstract model; it won't create its own table


class Diagnosis(models.TextChoices):
    CNV = "CNV", "Choroidal Neovascularization"
    DME = "DME", "Diabetes-Related Macular Edema"
    DRUSEN = "DRUSEN", "Drusen"
    VMT = "VMT", "Vitreomacular Traction"
    NORMAL = "NORMAL", "Normal"


class Patient(UUIDModel):
    firstname = models.CharField(max_length=255, help_text="First name of the patient")
    lastname = models.CharField(max_length=255, help_text="Last name of the patient")
    birthdate = models.DateField(help_text="Birthdate of the patient")
    national_id = models.CharField(max_length=255, help_text="National ID of the patient")
    phone = models.CharField(max_length=20, blank=True, null=True, help_text="Phone number of the patient")
    email = models.CharField(max_length=255, blank=True, null=True, help_text="Email of the patient")


class Examination(UUIDModel):
    date = models.DateField(help_text="Date of the examination")
    diagnosis = models.CharField(
        max_length=10,
        choices=Diagnosis.choices,
        blank=True,
        null=True,
        help_text="Diagnosis of the examination",
    )
    notes = models.TextField(blank=True, null=True, help_text="Notes for the examination")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, help_text="Patient of the examination")


def upload_to(instance, filename):
    """Custom path for uploaded files: uploads/<examination_pk>/<filename>"""
    return f"{instance.examination.id}/{filename}"


class Scan(UUIDModel):
    photo = models.FileField(upload_to=upload_to, help_text="Path to the scan file")
    examination = models.ForeignKey(Examination, on_delete=models.CASCADE, help_text="Examination of the scan")


class NetworkDiagnosis(UUIDModel):
    network_name = models.CharField(max_length=255, help_text="Name of the neural network")
    diagnosis = models.CharField(max_length=10, choices=Diagnosis.choices, help_text="Diagnosis from the network")
    confidence = models.FloatField(default=0.0, help_text="Confidence of the diagnosis [0-100]")
    scan = models.ForeignKey(
        Scan,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        help_text="Neural network diagnosis of the scan",
    )
