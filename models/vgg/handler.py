import torch
from torchvision import transforms
from ts.torch_handler.image_classifier import ImageClassifier
import torch.nn.functional as F


class VGGHandler(ImageClassifier):
    image_processing = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    def postprocess(self, data):
        class_labels = ["CNV", "DME", "DRUSEN", "NORMAL", "VMT"]
        predictions = []
        for output in data:
            probabilities = F.softmax(output, dim=0)  # Apply softmax to get probabilities
            confidence, predicted = torch.max(probabilities, 0)  # Get the max probability and class index
            predictions.append({
                "label": class_labels[predicted],
                "confidence": confidence.item(),
                "probabilities": {label: probabilities[i].item() for i, label in enumerate(class_labels)}
            })
        return predictions
