import cv2
import numpy as np
import os

img_path = r'd:\PROJECTS\ForHer\images\stones_real.jpeg'
out_dir = r'd:\PROJECTS\ForHer\images'

# Read image
img = cv2.imread(img_path)
if img is None:
    print("Could not read image")
    exit()

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Since background is black fabric, we can threshold.
# The stones should be lighter.
_, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)

# Morphological operations to clean up
kernel = np.ones((5,5), np.uint8)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Sort contours by area, descending, and take top 5
contours = sorted(contours, key=cv2.contourArea, reverse=True)
count = 1

for c in contours[:5]:
    # Get bounding box
    x, y, w, h = cv2.boundingRect(c)
    
    # We want a slightly larger bounding box to not cut edges
    pad = 10
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(img.shape[1], x + w + pad)
    y2 = min(img.shape[0], y + h + pad)
    
    # Crop
    crop_img = img[y1:y2, x1:x2]
    crop_mask = thresh[y1:y2, x1:x2]
    
    # Create RGBA image
    b, g, r = cv2.split(crop_img)
    alpha = np.where(crop_mask > 0, 255, 0).astype(np.uint8)
    
    # Optional: smooth the alpha channel
    alpha = cv2.GaussianBlur(alpha, (5,5), 0)
    
    rgba = cv2.merge([b, g, r, alpha])
    
    # Save as webp
    out_path = os.path.join(out_dir, f'stone_{count}.webp')
    cv2.imwrite(out_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 100])
    print(f"Saved {out_path}")
    count += 1
