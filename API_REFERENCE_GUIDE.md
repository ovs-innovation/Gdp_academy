# Quick Reference: API Endpoints & Services

## 🔗 Backend Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: Will be configured during deployment

## 📡 Key API Endpoints

### Authentication

```
POST /auth/register          - Register new user
POST /auth/login             - Login user
GET  /auth/me                - Get current user
POST /auth/forgot            - Request password reset
POST /auth/reset             - Reset password
POST /auth/change-password   - Change password
```

### Programs & Workshops

```
GET  /public/courses                      - List programs/workshops
GET  /public/courses/:slug                - Get program/workshop detail
GET  /public/courses/:slug/teachers       - Get teachers for course
GET  /public/courses/availability         - Get available slots
GET  /public/categories                   - Get dance styles/categories
```

### Enquiries

```
POST /enquiries              - Submit enquiry (no auth required)
GET  /enquiries              - Get all enquiries (admin)
GET  /enquiries/:id          - Get single enquiry (admin)
PUT  /enquiries/:id          - Update enquiry (admin)
DELETE /enquiries/:id        - Delete enquiry (admin)
GET  /enquiries/stats        - Get statistics (admin)
```

### CMS Content

```
GET  /cms/section/:section   - Get content by section
GET  /cms/key/:key           - Get content by key
POST /cms                    - Create/update CMS (admin)
GET  /cms                    - List all CMS (admin)
DELETE /cms/:id              - Delete CMS (admin)
```

### Blog

```
GET  /blogs                  - List blogs
GET  /blogs/slug/:slug       - Get blog by slug
GET  /blogs/:id              - Get blog by ID
GET  /blogs/:id/related      - Get related blogs
POST /blogs                  - Create blog (admin)
PUT  /blogs/:id              - Update blog (admin)
DELETE /blogs/:id            - Delete blog (admin)
```

### Gallery

```
GET  /gallery                - List galleries
GET  /gallery/:id            - Get gallery
GET  /gallery/category/:cat  - Get by category
POST /gallery                - Create gallery (admin)
PUT  /gallery/:id            - Update gallery (admin)
POST /gallery/:id/items      - Add item (admin)
DELETE /gallery/:id/items/:id - Remove item (admin)
DELETE /gallery/:id          - Delete gallery (admin)
```

### Testimonials

```
GET  /testimonials/featured  - Get featured testimonials
GET  /testimonials           - List testimonials
GET  /testimonials/:id       - Get testimonial
POST /testimonials           - Create (admin)
PUT  /testimonials/:id       - Update (admin)
POST /testimonials/reorder   - Reorder (admin)
DELETE /testimonials/:id     - Delete (admin)
```

### Payments

```
POST /payments/create-intent        - Create Stripe intent
POST /payments/stripe/webhook       - Stripe webhook
GET  /bookings                      - Get my bookings
POST /bookings/register             - Register for workshop
```

## 🛠️ Frontend Services Usage

### Enquiry Service

```typescript
import { submitEnquiry, getEnquiries } from "@/services/enquiryService";

// Submit enquiry
await submitEnquiry({
  name: "John",
  email: "john@example.com",
  phone: "+1234567890",
  message: "I want to join",
  source: "contact_form",
});

// Get enquiries (admin)
const { enquiries, total } = await getEnquiries(token, {
  status: "new",
  page: 1,
  limit: 10,
});
```

### Blog Service

```typescript
import { getBlogs, getBlogBySlug } from "@/services/blogService";

// Get all blogs
const { blogs } = await getBlogs({ status: "published", page: 1 });

// Get single blog
const blog = await getBlogBySlug("my-blog-post");
```

### CMS Service

```typescript
import { getCMSByKey, getCMSBySection } from "@/services/cmsService";

// Get CMS content
const hero = await getCMSByKey("hero_section");
const services = await getCMSBySection("services");
```

### Gallery Service

```typescript
import { getGalleries, getGalleryById } from "@/services/galleryService";

// Get galleries
const { galleries } = await getGalleries({ category: "performances" });
```

### Testimonial Service

```typescript
import { getFeaturedTestimonials } from "@/services/testimonialService";

// Get featured testimonials
const testimonials = await getFeaturedTestimonials(5);
```

### Program Service

```typescript
import {
  fetchPrograms,
  fetchProgram,
  fetchWorkshops,
} from "@/services/programService";

// Get programs
const { Programs } = await fetchPrograms({ status: "active" });

// Get specific program
const { Program } = await fetchProgram("hip-hop-basics");

// Get workshops
const { programs: workshops } = await fetchWorkshops({ status: "active" });
```

## 📱 Common Component Patterns

### Loading Data

```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

useEffect(() => {
  const load = async () => {
    try {
      const result = await someService.fetch();
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);
```

### Auth Header

```typescript
const token = localStorage.getItem("auth_token");
const headers = {
  Authorization: `Bearer ${token}`,
};
```

### Admin Check

```typescript
const user = JSON.parse(localStorage.getItem("auth_user"));
const isAdmin = user?.role === "admin" || user?.role === "super_admin";
```

## 🔐 Authentication Flow

1. User signs up/logs in
2. Backend returns token and user object
3. Frontend stores in localStorage:
   ```
   localStorage.setItem('auth_token', token)
   localStorage.setItem('auth_user', JSON.stringify(user))
   ```
4. Use token for all admin/protected endpoints

## 📦 CMS Keys Reference

```
hero_section      - Homepage hero content
about_us          - About Us page
services          - Services overview
faq_page          - FAQ content
footer            - Footer content
announcements     - Platform announcements
```

## 🎨 CMS Section Types

```
hero              - Hero sections
about             - About pages
services          - Service descriptions
testimonials      - Testimonial sections
faq               - FAQ sections
footer            - Footer content
general           - General content
```

## 💳 Payment Status Tracking

```
pending           - Payment not yet processed
completed         - Payment successful
failed            - Payment failed
refunded          - Payment refunded
```

## 👥 User Roles

```
student           - Regular user
admin             - Admin user
super_admin       - Super admin user
```

## 📊 Enquiry Status Values

```
new               - Just submitted
in_progress       - Being handled
closed            - Resolved
```

## 🏷️ Enquiry Source Values

```
program           - Enquiry from program page
workshop          - Enquiry from workshop page
contact_form      - From contact page
general           - General enquiry
```

## 🔗 Important Links

**Documentation Files:**

- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) - Full implementation plan
- [COURSE_PROGRESS_EXPLAINED.md](./COURSE_PROGRESS_EXPLAINED.md) - Course system
- [MULTI_CURRENCY_SETUP.md](./MULTI_CURRENCY_SETUP.md) - Currency handling
- [PLATFORM_FEE_TESTING.md](./PLATFORM_FEE_TESTING.md) - Payment testing

**Service Files:**

- [enquiryService.ts](./frontend/src/services/enquiryService.ts)
- [blogService.ts](./frontend/src/services/blogService.ts)
- [galleryService.ts](./frontend/src/services/galleryService.ts)
- [cmsService.ts](./frontend/src/services/cmsService.ts)
- [testimonialService.ts](./frontend/src/services/testimonialService.ts)
- [programService.ts](./frontend/src/services/programService.ts)
- [authService.ts](./frontend/src/services/authService.ts)

**Backend Models:**

- enquiryModel.js
- cmsModel.js
- blogModel.js
- galleryModel.js
- testimonialModel.js
- courseModel.js (enhanced)

## ✅ Health Check Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/auth/me

# Check if frontend is running
curl http://localhost:5173

# List all API routes
curl http://localhost:5000/api

# Get CMS content
curl http://localhost:5000/api/cms/section/hero

# Get featured testimonials
curl http://localhost:5000/api/testimonials/featured
```

## 🐛 Common Issues & Solutions

**"401 Unauthorized"**

- Solution: Add valid token to Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN_HERE`

**"CORS Error"**

- Solution: Backend CORS is configured, ensure proper headers

**"CMS not found"**

- Solution: Create CMS content via admin panel first

**"404 on enrollment"**

- Solution: Ensure program/workshop ID is valid

## 📝 Environment Variables

```
VITE_API_BASE_URL=http://localhost:5000/api
STRIPE_PUBLIC_KEY=pk_test_...
```

## 🚀 Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Static files uploaded to CDN
- [ ] Email service configured
- [ ] Payment processor configured
- [ ] Domain SSL certificates installed
- [ ] Error monitoring setup
- [ ] Database backups configured
- [ ] API rate limiting enabled
- [ ] Security headers configured
