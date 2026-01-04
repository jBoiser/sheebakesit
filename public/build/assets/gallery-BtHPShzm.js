(function(){const s={list:"/api/gallery",store:"/api/gallery/store",update:"/api/gallery/update",delete:"/api/gallery/delete"},d=()=>document.querySelector('meta[name="csrf-token"]')?.content||"";let o=[];const r={init:function(){this.setupEventListeners()},setupEventListeners:function(){const t=document.getElementById("galleryImageInput");t&&t.addEventListener("change",e=>this.handleImagePreview(e))},handleImagePreview:function(t){const e=t.target.files[0],n=document.getElementById("galleryImagePreview"),a=document.getElementById("galleryImagePlaceholder");if(e){const l=new FileReader;l.onload=function(c){n.src=c.target.result,n.classList.remove("d-none"),a&&a.classList.add("d-none")},l.readAsDataURL(e)}},fetchItems:async function(){const t=document.getElementById("loader-overlay");t&&t.classList.remove("d-none");try{const n=await(await fetch(s.list)).json();n.status==="success"&&(o=n.data,this.renderTable(),this.updateStats())}catch(e){console.error("Gallery fetch error:",e)}finally{t&&t.classList.add("d-none")}},renderTable:function(){const t=document.getElementById("gallery-table-body");if(t){if(o.length===0){t.innerHTML='<tr><td colspan="6" class="text-center py-4">No gallery items found.</td></tr>';return}t.innerHTML=o.map(e=>`
                <tr class="align-middle">
                    <td class="fw-bold text-muted ps-4">#${e.id}</td>
                    <td>
                        <img src="${e.image_url}" class="rounded shadow-sm" style="width: 50px; height: 50px; object-fit: cover; cursor: pointer;" 
                            onclick="galleryManager.viewPhoto('${e.image_url}', '${e.title}')">
                    </td>
                    <td><div class="fw-bold">${e.title}</div></td>
                    <td><div class="text-truncate text-muted small" style="max-width: 150px;">${e.description||"---"}</div></td>
                    <td><div class="text-muted small">${e.created_at}</div></td>
                    <td>
                        <span class="badge rounded-pill ${e.status==="active"?"bg-success":"bg-secondary"}">
                            ${e.status}
                        </span>
                    </td>
                    <td class="pe-4">
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary rounded-pill me-2" onclick="galleryManager.openEditModal(${e.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="galleryManager.deleteItem(${e.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join("")}},updateStats:function(){const t=o.length,e=o.filter(a=>a.status==="active").length,n=t-e;document.getElementById("gallery-stat-total").innerText=t,document.getElementById("gallery-stat-active").innerText=e,document.getElementById("gallery-stat-inactive").innerText=n},viewPhoto:function(t,e){document.getElementById("viewPhotoTitle").innerText=e,document.getElementById("viewPhotoContent").src=t,new bootstrap.Modal(document.getElementById("viewPhotoModal")).show()},openAddModal:function(){document.getElementById("galleryForm").reset(),document.getElementById("galleryItemId").value="",document.getElementById("galleryModalTitle").innerText="Add New Image",document.getElementById("galleryImagePreview").classList.add("d-none"),document.getElementById("galleryImagePlaceholder").classList.remove("d-none"),new bootstrap.Modal(document.getElementById("galleryModal")).show()},openEditModal:function(t){const e=o.find(l=>l.id==t);if(!e)return;document.getElementById("galleryItemId").value=e.id,document.getElementById("galleryTitle").value=e.title,document.getElementById("galleryDescription").value=e.description||"",document.getElementById("galleryStatus").value=e.status,document.getElementById("galleryModalTitle").innerText="Edit Image";const n=document.getElementById("galleryImagePreview"),a=document.getElementById("galleryImagePlaceholder");n.src=e.image_url,n.classList.remove("d-none"),a.classList.add("d-none"),new bootstrap.Modal(document.getElementById("galleryModal")).show()},saveItem:async function(){const t=document.getElementById("galleryForm"),e=new FormData(t),a=document.getElementById("galleryItemId").value?s.update:s.store;try{(await(await fetch(a,{method:"POST",headers:{"X-CSRF-TOKEN":d()},body:e})).json()).status==="success"&&(bootstrap.Modal.getInstance(document.getElementById("galleryModal")).hide(),this.fetchItems())}catch(l){console.error("Save error:",l)}},deleteItem:async function(t){if(confirm("Are you sure you want to delete this gallery item?"))try{(await(await fetch(s.delete,{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":d()},body:JSON.stringify({id:t})})).json()).status==="success"&&this.fetchItems()}catch(e){console.error("Delete error:",e)}}};window.galleryManager=r,document.addEventListener("DOMContentLoaded",()=>{r.init();const t=document.getElementById("page-gallery");t&&new MutationObserver(n=>{n.forEach(a=>{a.target.id==="page-gallery"&&!a.target.classList.contains("d-none")&&r.fetchItems()})}).observe(t,{attributes:!0,attributeFilter:["class"]})})})();
