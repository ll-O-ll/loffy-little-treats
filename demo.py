
import requests

url = "https://graph.facebook.com/v22.0/964114293442074/messages"
headers = {
    "Authorization": "Bearer EAAWvgjd2c6IBQENIQfYnZCPOQUB4nH11VhMcWFTRupdpGljAjDNhvkZBLIZAEVZA8xMU87lZCoCU5CwqYvvLRj2sbwOLYV5cnbM3Vq3JRFxZBBoJFptPWZBbxAQUZATbmRFC6GGKNSqqHcd8SUe3873PLtdFMQ2ZBEUG9kjNiPpu7G4CEA7f8qnZCbuCXe2I0lNwMKYx7U0mV4YoRLW3ZA0DhumKYecubjI12T5mk3o9Xsu1ZBSRw0iSXDJnEqhYnXXEaZAsIm8CbSPryzNvvoj7tmZCR0fB667UHZAOcsxYOgZD",
    "Content-Type": "application/json",
}
data = {
    "messaging_product": "whatsapp",
    "to": "16475806460",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {"code": "en_US"},
    }
}
                  
response = requests.post(url, headers=headers, json=data, timeout=30)
print(response.json())