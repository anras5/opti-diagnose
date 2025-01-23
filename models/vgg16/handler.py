import torch
import torch.nn.functional as F
from torchvision import transforms
from ts.torch_handler.image_classifier import ImageClassifier


class VGGHandler(ImageClassifier):
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    image_processing = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.Lambda(lambda img: img.convert("RGB") if img.mode != "RGB" else img),
        transforms.ToTensor(),
        transforms.Normalize(mean, std)
    ])

    def postprocess(self, data):
        class_labels = ["CNV", "DME", "DRUSEN", "NORMAL"]
        predictions = []
        for output in data:
            probabilities = F.softmax(output, dim=0)
            confidence, predicted_idx = torch.max(probabilities, 0)
            predictions.append({
                "label": class_labels[predicted_idx],
                "confidence": confidence.item(),
                "probabilities": {label: probabilities[i].item() for i, label in enumerate(class_labels)}
            })
        return predictions
