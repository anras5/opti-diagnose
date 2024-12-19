import torch
from torchvision import transforms
from ts.torch_handler.image_classifier import ImageClassifier


class VGGHandler(ImageClassifier):
    image_processing = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    def postprocess(self, data):
        class_labels = ["CNV", "DME", "DRUSEN", "NORMAL", "VMT"]
        predictions = []
        for output in data:
            _, predicted = torch.max(output, 0)
            predictions.append(class_labels[predicted])
        return predictions
