import os

filepath = 'frontend/src/pages/admin/AdminProductEdit.jsx'
with open(filepath, 'r') as f:
    content = f.read()

old_code = """  const handleAddImage = () => {
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };"""

new_code = """  const handleAddImage = () => {
    if (imageUrl) {
      // Validate URL to prevent XSS (e.g. javascript: schemes)
      try {
        const parsedUrl = new URL(imageUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          toast({
            variant: "destructive",
            title: "Fehler",
            description: "Ungültige Bild-URL. Nur http/https erlaubt.",
          });
          return;
        }
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Bitte geben Sie eine gültige URL ein.",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open(filepath, 'w') as f:
        f.write(content)
    print("XSS fix applied.")
else:
    print("Could not find code block to replace.")
