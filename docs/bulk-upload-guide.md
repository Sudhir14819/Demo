# Bulk Product Upload Guide

## Overview
The bulk upload feature allows administrators to upload multiple products at once using CSV or JSON files. This guide provides detailed instructions and examples for successful bulk uploads.

## Supported Formats

### CSV Format
CSV files should include a header row with the following columns:

**Required Columns:**
- `name`: Product name (string)
- `description`: Product description (string)
- `price`: Product price in INR (number)
- `category`: Main category (string)
- `stock`: Available quantity (number)
- `sku`: Unique product identifier (string)

**Optional Columns:**
- `subcategory`: Product subcategory (string)
- `images`: Comma-separated image filenames (string)
- `weight`: Product weight (string)
- `dimensions`: Product dimensions (string)
- `features`: Comma-separated features (string)
- `tags`: Comma-separated tags (string)

### JSON Format
JSON files should contain an array of product objects with the same fields as CSV.

## File Size Limits
- Maximum file size: 10MB
- Maximum products per upload: 1000
- Supported file extensions: .csv, .json

## Upload Process

1. **Prepare Your File**
   - Download the sample template from the admin dashboard
   - Fill in your product data following the format guidelines
   - Validate your data before upload

2. **Upload via Admin Dashboard**
   - Navigate to Admin → Products → Bulk Upload
   - Select your prepared file
   - Click "Upload Products"
   - Monitor the upload progress

3. **Review Results**
   - Check the upload summary for success/failure counts
   - Download the error report if any products failed
   - Fix errors and re-upload failed products

## Data Validation Rules

### Product Name
- Required field
- Maximum 200 characters
- Must be unique within the same category

### Price
- Required field
- Must be a positive number
- Automatically converted to INR if needed

### SKU (Stock Keeping Unit)
- Required field
- Must be unique across all products
- Alphanumeric characters only
- Maximum 50 characters

### Category
- Required field
- Must match existing categories or will be created automatically
- Case-insensitive matching

### Stock
- Required field
- Must be a non-negative integer
- Represents available quantity

### Images
- Optional field
- Multiple images separated by commas
- Image files should be uploaded separately to the media library
- Supported formats: JPG, PNG, WebP

## Error Handling

Common upload errors and solutions:

### Duplicate SKU
**Error:** "SKU already exists"
**Solution:** Ensure all SKUs are unique across your product catalog

### Invalid Price
**Error:** "Price must be a positive number"
**Solution:** Check that all prices are valid numbers greater than 0

### Missing Required Fields
**Error:** "Required field missing"
**Solution:** Ensure all required columns have values

### File Format Issues
**Error:** "Invalid file format"
**Solution:** Check file extension and internal format match

## Best Practices

1. **Start Small**
   - Test with a small batch (10-20 products) first
   - Verify the upload process works correctly
   - Scale up to larger batches

2. **Data Preparation**
   - Use the provided templates
   - Validate data in spreadsheet software before upload
   - Keep backup copies of your data

3. **Image Management**
   - Upload product images to the media library first
   - Use consistent naming conventions
   - Optimize images for web (under 1MB each)

4. **Regular Backups**
   - Export your product catalog regularly
   - Keep version history of bulk uploads
   - Document any custom fields or modifications

## Sample Data

### CSV Example
\`\`\`csv
name,description,price,category,subcategory,stock,sku,images
Tomato Seeds,Premium hybrid tomato seeds,299,Seeds,Vegetable Seeds,100,TOM001,tomato-1.jpg
Chili Seeds,Hot pepper seeds,199,Seeds,Vegetable Seeds,150,CHI001,chili-1.jpg
Rose Plant,Beautiful red roses,599,Plants,Flowering Plants,50,ROS001,"rose-1.jpg,rose-2.jpg"
\`\`\`

### JSON Example
\`\`\`json
[
  {
    "name": "Tomato Seeds",
    "description": "Premium hybrid tomato seeds",
    "price": 299,
    "category": "Seeds",
    "subcategory": "Vegetable Seeds",
    "stock": 100,
    "sku": "TOM001",
    "images": ["tomato-1.jpg"]
  }
]
\`\`\`

## Troubleshooting

### Upload Fails Completely
1. Check file format and size
2. Verify admin permissions
3. Check network connection
4. Try with a smaller file

### Partial Upload Success
1. Download the error report
2. Fix the identified issues
3. Re-upload only the failed products
4. Verify the final product count

### Performance Issues
1. Reduce batch size (try 100-200 products)
2. Upload during off-peak hours
3. Ensure stable internet connection
4. Contact support for large catalogs (>5000 products)

## Support
For technical support with bulk uploads:
- Email: support@yourplatform.com
- Documentation: /docs/api-documentation
- Admin Help: Available in the dashboard
