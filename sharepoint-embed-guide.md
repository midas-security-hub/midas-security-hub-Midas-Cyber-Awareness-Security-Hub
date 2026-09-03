# How to Add This Element to a SharePoint Page

This **Account & Password Security** element is built as a single, self-contained `index.html` file that can easily be embedded in Microsoft SharePoint Modern Pages.

---

## Method 1: Host File in SharePoint Documents & Use Embed Web Part (Recommended)

1. **Upload the file to SharePoint**:
   - Go to your SharePoint Site -> **Site Contents** -> **Documents** (or Site Assets).
   - Click **Upload** -> **File** and select `index.html`.
   - Click the three dots `...` next to `index.html` in SharePoint and select **Copy link**.

2. **Add to SharePoint Modern Page**:
   - Go to the SharePoint page where you want to display this element and click **Edit** (top right).
   - Hover over the section where you want to insert the element and click the **`+` (Add a new web part)** button.
   - Search for **Embed** and select the **Embed Web Part**.

3. **Paste the Iframe Code**:
   - In the Embed properties panel on the right, paste the following snippet (replace `YOUR_SHAREPOINT_FILE_URL` with your copied file link):

```html
<iframe src="YOUR_SHAREPOINT_FILE_URL" width="100%" height="750px" frameborder="0" scrolling="auto" style="border:none; border-radius:16px;"></iframe>
```

---

## Method 2: Embed Directly Using `srcdoc` (No File Hosting Needed)

If your SharePoint Embed Web Part allows inline HTML (`srcdoc`), you can paste this directly into the Embed Web Part snippet box:

```html
<iframe srcdoc="<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body>...YOUR INDEX.HTML CODE HERE...</body></html>" width="100%" height="750px" frameborder="0" style="border:none;"></iframe>
```

---

## Tips for Best Layout in SharePoint:
- **Full Width / 1 Column Section**: Best for showing all 9 step cards in a clean 3-column grid.
- **2/3 Column Section**: Works seamlessly with responsive single/two-column scaling.
- **Recommended Height**: `750px` to `800px` to display all tabs without extra scrollbars.
