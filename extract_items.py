import cv2
import numpy as np
import os

out_dir = r'd:\PROJECTS\ForHer\images'

def extract_items(img_path, prefix, num_items=5):
    img = cv2.imread(img_path)
    if img is None:
        print(f"Could not read image {img_path}")
        return

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Use adaptive thresholding or simple thresholding
    # Since we don't know the background, we can check the corners.
    # If corners are light, it's a white background, invert it.
    bg_color = np.median([gray[0,0], gray[0,-1], gray[-1,0], gray[-1,-1]])
    
    if bg_color > 127: # light background
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)
    else: # dark background
        _, thresh = cv2.threshold(gray, 50, 255, cv2.THRESH_BINARY)

    # Morphological operations to clean up
    kernel = np.ones((5,5), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Sort contours by area, descending
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    
    # Filter out very small noise contours (less than 100 pixels)
    contours = [c for c in contours if cv2.contourArea(c) > 500]

    count = 1
    for c in contours[:num_items]:
        x, y, w, h = cv2.boundingRect(c)
        pad = 10
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(img.shape[1], x + w + pad)
        y2 = min(img.shape[0], y + h + pad)
        
        crop_img = img[y1:y2, x1:x2]
        crop_mask = thresh[y1:y2, x1:x2]
        
        b, g, r = cv2.split(crop_img)
        alpha = np.where(crop_mask > 0, 255, 0).astype(np.uint8)
        
        # Smooth alpha
        alpha = cv2.GaussianBlur(alpha, (5,5), 0)
        
        rgba = cv2.merge([b, g, r, alpha])
        
        out_path = os.path.join(out_dir, f'{prefix}_{count}.webp')
        cv2.imwrite(out_path, rgba, [cv2.IMWRITE_WEBP_QUALITY, 100])
        print(f"Saved {out_path}")
        count += 1

extract_items(r'd:\PROJECTS\ForHer\images\kitkat_real.png', 'choco')
extract_items(r'd:\PROJECTS\ForHer\images\pen_real.png', 'pen')
