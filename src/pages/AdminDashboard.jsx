import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState('');

  // جلب المنتجات
  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) {
      alert('خطأ في جلب المنتجات: ' + error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // رفع الصورة
  async function uploadImage(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = fileName;

      setUploading(true);
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      setUploading(false);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('فشل رفع الصورة: ' + uploadError.message);
        return null;
      }

      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Public URL error:', urlError);
        return null;
      }

      return publicUrlData.publicUrl;
    } catch (err) {
      setUploading(false);
      console.error('Unexpected upload failure:', err);
      return null;
    }
  }

  // حذف صورة من التخزين
  async function deleteImageByUrl(url) {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const { error } = await supabase.storage.from('product-images').remove([fileName]);
      if (error) console.error('Error deleting image:', error);
    } catch (error) {
      console.error('Error parsing image URL for deletion:', error);
    }
  }

  // مسح الفورم
  function clearForm() {
    setName('');
    setPrice('');
    setDescription('');
    setImageFile(null);
    setImageUrlInput('');
    setEditingId(null);
  }

  // حفظ أو تعديل المنتج
  async function handleSave(e) {
    e.preventDefault();

    if (!name || !price || !description) {
      alert('الرجاء تعبئة جميع الحقول.');
      return;
    }

    let finalImageUrl = null;

    if (imageUrlInput) {
      finalImageUrl = imageUrlInput;
    } else if (imageFile) {
      if (editingId) {
        // إذا تعديل وحصلت على صورة سابقة، احذفها
        const existingProduct = products.find((p) => p.id === editingId);
        if (existingProduct?.image_url) {
          await deleteImageByUrl(existingProduct.image_url);
        }
      }
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) return;
      finalImageUrl = uploaded;
    } else if (editingId) {
      // إذا تعديل ولم يتم رفع صورة جديدة أو إدخال رابط جديد، احتفظ بالصورة القديمة
      const existingProduct = products.find((p) => p.id === editingId);
      finalImageUrl = existingProduct?.image_url || null;
    }

    if (editingId) {
      // تعديل
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price: parseFloat(price),
          description,
          image_url: finalImageUrl,
        })
        .eq('id', editingId);

      if (error) {
        alert('خطأ في تعديل المنتج: ' + error.message);
      } else {
        alert('تم تعديل المنتج بنجاح.');
        clearForm();
        fetchProducts();
      }
    } else {
      // إضافة جديد
      const { error } = await supabase.from('products').insert([
        {
          name,
          price: parseFloat(price),
          description,
          image_url: finalImageUrl,
        },
      ]);

      if (error) {
        alert('خطأ في إضافة المنتج: ' + error.message);
      } else {
        alert('تمت إضافة المنتج بنجاح.');
        clearForm();
        fetchProducts();
      }
    }
  }

  // حذف المنتج
  async function handleDelete(id) {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    const product = products.find((p) => p.id === id);
    if (product?.image_url) {
      await deleteImageByUrl(product.image_url);
    }

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('خطأ في حذف المنتج: ' + error.message);
    } else {
      alert('تم حذف المنتج.');
      fetchProducts();
    }
  }

  // تحميل بيانات المنتج للتعديل
  function handleEdit(product) {
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setImageUrlInput(product.image_url || '');
    setImageFile(null);
    setEditingId(product.id);
  }

  // فلترة المنتجات للبحث
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
      <h1>لوحة تحكم المشرف</h1>
      <p>مرحباً بك في الإدارة، يمكنك هنا إدارة المنتجات والمحتوى.</p>
      <button onClick={() => window.location.href = '/admin/logout'}>تسجيل الخروج</button>

      <hr style={{ margin: '20px 0' }} />

      <h2>{editingId ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
      <form onSubmit={handleSave} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="السعر"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
          required
        />
        <textarea
          placeholder="الوصف"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 10, height: 80 }}
          required
        />

        <div style={{ marginBottom: 10 }}>
          <label>رفع صورة المنتج:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>أو رابط صورة موجود:</label>
          <input
            type="text"
            placeholder="https://...png"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        {imageUrlInput && (
          <div style={{ marginBottom: 10 }}>
            <p>معاينة رابط الصورة:</p>
            <img src={imageUrlInput} alt="معاينة صورة" style={{ width: 120, objectFit: 'cover' }} />
          </div>
        )}

        <button type="submit" disabled={uploading} style={{ padding: '10px 20px' }}>
          {uploading ? 'جارٍ الرفع...' : editingId ? 'تعديل المنتج' : 'إضافة المنتج'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
            style={{ marginLeft: 10, padding: '10px 20px' }}
          >
            إلغاء
          </button>
        )}
      </form>

      <hr />

      <h2>المنتجات</h2>

      <div style={{ margin: '10px 0' }}>
        <input
          type="text"
          placeholder="بحث بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
      </div>

      {loading ? (
        <p>جاري تحميل المنتجات...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>صورة</th>
              <th style={{ padding: 8, textAlign: 'left' }}>الاسم</th>
              <th style={{ padding: 8, textAlign: 'left' }}>السعر</th>
              <th style={{ padding: 8, textAlign: 'left' }}>الوصف</th>
              <th style={{ padding: 8, textAlign: 'left' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 8, textAlign: 'center' }}>
                  لا توجد منتجات مطابقة.
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: 80, height: 60, objectFit: 'cover' }}
                    />
                  ) : (
                    'لا توجد صورة'
                  )}
                </td>
                <td style={{ padding: 8 }}>{product.name}</td>
                <td style={{ padding: 8 }}>{product.price.toFixed(2)}</td>
                <td style={{ padding: 8 }}>{product.description}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleEdit(product)} style={{ marginRight: 10 }}>
                    تعديل
                  </button>
                  <button onClick={() => handleDelete(product.id)} style={{ color: 'red' }}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
