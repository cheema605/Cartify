import torch
from transformers import DistilBertModel, DistilBertTokenizerFast
import sys
import json

class IntentClassifier(torch.nn.Module):
    def __init__(self, hidden_size, num_labels):
        super().__init__()
        self.bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
        self.classifier = torch.nn.Linear(hidden_size, num_labels)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.last_hidden_state[:, 0]  # [CLS] token
        logits = self.classifier(pooled_output)
        return logits

tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
label2id = torch.load("routes/chatbot/label2id.pt")
id2label = {i: label for label, i in label2id.items()}

model = IntentClassifier(hidden_size=768, num_labels=len(label2id))
model.load_state_dict(torch.load("routes/chatbot/intent_model.pt"))

def predict_intent(text):
    import sys
    print(f"Received text: {text}", file=sys.stderr)  # Debug print to stderr
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=32)
    with torch.no_grad():
        logits = model(inputs["input_ids"], inputs["attention_mask"])
        predicted = torch.argmax(logits, dim=1).item()
    print(f"Predicted intent: {predicted}", file=sys.stderr)  # Debug print to stderr
    return id2label[predicted]

import sys

# Get the input text from the arguments
if len(sys.argv) < 2 or not sys.argv[1].strip():
    print(json.dumps({"error": "No input text provided"}))
    sys.exit(1)

text = sys.argv[1]  # First argument passed to script

# Get the intent prediction
predicted_intent = predict_intent(text)

# Output result as JSON
result = json.dumps({"intent": predicted_intent})
print(result)
