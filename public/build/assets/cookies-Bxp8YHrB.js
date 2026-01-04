(function(){const d={list:"/api/cookies",store:"/api/cookies/store",update:"/api/cookies/update",delete:"/api/cookies/delete"},m=()=>document.querySelector('meta[name="csrf-token"]')?.content||"";let i=[],l=null;function r(o){return typeof o!="string"?o:o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const c={init:function(){this.ensureModalsExist();const o=document.getElementById("cookieImageInput");o&&(o.removeEventListener("change",this.handleImagePreview),o.addEventListener("change",this.handleImagePreview)),console.log("Cookie Manager Initialized")},ensureModalsExist:function(){if(document.getElementById("spaAlertModal"))return;document.body.insertAdjacentHTML("beforeend",`
                <!-- Shared Alert Modal -->
                <div class="modal fade" id="spaAlertModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="spaAlertTitle">Notice</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="spaAlertBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-dark btn-sm px-4 rounded-pill" data-bs-dismiss="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shared Confirm Modal -->
                <div class="modal fade" id="spaConfirmModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                             <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="spaConfirmTitle">Confirm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="spaConfirmBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger btn-sm rounded-pill px-3" id="spaConfirmBtn">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            `),document.getElementById("spaConfirmBtn").addEventListener("click",()=>{typeof l=="function"&&l();const e=document.getElementById("spaConfirmModal");bootstrap.Modal.getInstance(e).hide()})},fetchCookies:async function(){if(document.getElementById("cookiesTableBody")){this.toggleLoader(!0);try{const e=await fetch(d.list,{credentials:"same-origin"});if(e.redirected){window.location.href=e.url;return}if(!e.ok)throw new Error("Server Error");const t=await e.json();t.status==="success"&&(i=t.data,this.renderTable(i),this.updateStats(i))}catch(e){console.error("Fetch Error:",e)}finally{this.toggleLoader(!1)}}},renderTable:function(o){const e=document.getElementById("cookiesTableBody");if(e.innerHTML="",o.length===0){e.innerHTML=`
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            No cookies found. Add some deliciousness!
                        </td>
                    </tr>`;return}o.forEach(t=>{const n=t.status==="active"?'<span class="badge bg-success rounded-pill px-2">Active</span>':'<span class="badge bg-secondary rounded-pill px-2">Inactive</span>',a=`<span class="badge bg-light text-dark border">${r(t.category)}</span>`,s=document.createElement("tr");s.innerHTML=`
                    <td class="ps-4 fw-bold text-pink">${r(t.id)}</td>
                    <td>
                        <img src="${t.image_url||"/storage/footers/logo1.png"}"
                             class="rounded-3 shadow-sm"
                             style="width:50px;height:50px;object-fit:cover;">
                    </td>
                    <td class="fw-semibold">${r(t.name)}</td>
                    <td>${a}</td>
                    <td class="fw-bold">$${parseFloat(t.price).toFixed(2)}</td>
                    <td>${n}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill me-1"
                            onclick="window.cookieManager.openEditModal('${t.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill"
                            onclick="window.cookieManager.deleteCookie('${t.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `,e.appendChild(s)})},updateStats:function(o){const e=(t,n)=>{const a=document.getElementById(t);a&&(a.innerText=n)};e("cookie-stat-total",o.length),e("cookie-stat-active",o.filter(t=>t.status==="active").length),e("cookie-stat-inactive",o.filter(t=>t.status==="inactive").length)},openAddModal:function(){document.getElementById("cookieForm").reset(),document.getElementById("cookieId").value="",document.getElementById("cookieModalTitle").innerText="Add New Cookie";const o=document.getElementById("cookiePreview");o&&(o.src="/storage/footers/logo1.png"),new bootstrap.Modal(document.getElementById("cookieModal")).show()},openEditModal:function(o){const e=i.find(t=>t.id===o);e&&(document.getElementById("cookieId").value=e.id,document.getElementById("cookieName").value=e.name,document.getElementById("cookiePrice").value=e.price,document.getElementById("cookieCategory").value=e.category,document.getElementById("cookieStatus").value=e.status,document.getElementById("cookiePreview").src=e.image_url,document.getElementById("cookieModalTitle").innerText="Edit Cookie ("+e.id+")",new bootstrap.Modal(document.getElementById("cookieModal")).show())},saveCookie:async function(){const o=document.getElementById("cookieForm"),e=new FormData(o),t=document.getElementById("cookieId").value,n=t?d.update:d.store;if(!t&&document.getElementById("cookieImageInput").files.length===0){this.safeAlert("Missing Image","Please upload a cookie image.");return}this.toggleLoader(!0);try{const s=await(await fetch(n,{method:"POST",credentials:"same-origin",headers:{"X-CSRF-TOKEN":m()},body:e})).json();if(s.status==="success")this.safeAlert("Success",s.message),bootstrap.Modal.getInstance(document.getElementById("cookieModal")).hide(),this.fetchCookies();else{let u=s.message||"An error occurred";s.errors&&(u=Object.values(s.errors).flat().join(`
`)),this.safeAlert("Error",u)}}catch(a){console.error(a),this.safeAlert("Error","Server connection error.")}finally{this.toggleLoader(!1)}},deleteCookie:function(o){if(window.spa&&typeof window.spa.confirm=="function"){window.spa.confirm("Delete Cookie","Are you sure? This cannot be undone.",()=>this.proceedDelete(o));return}document.getElementById("spaConfirmModal")?(document.getElementById("spaConfirmTitle").innerText="Delete Cookie",document.getElementById("spaConfirmBody").innerText="Are you sure? This cannot be undone.",l=()=>this.proceedDelete(o),new bootstrap.Modal(document.getElementById("spaConfirmModal")).show()):confirm("Delete this cookie?")&&this.proceedDelete(o)},proceedDelete:async function(o){this.toggleLoader(!0);try{const e=new FormData;e.append("id",o);const n=await(await fetch(d.delete,{method:"POST",credentials:"same-origin",headers:{"X-CSRF-TOKEN":m()},body:e})).json();n.status==="success"?(this.safeAlert("Deleted",n.message),this.fetchCookies()):this.safeAlert("Error",n.message)}catch(e){console.error(e)}finally{this.toggleLoader(!1)}},handleImagePreview:function(o){const e=o.target.files[0];if(!e)return;const t=new FileReader;t.onload=function(n){document.getElementById("cookiePreview").src=n.target.result},t.readAsDataURL(e)},toggleLoader:function(o){const e=document.getElementById("page-cookies");if(!e)return;let t=document.getElementById("cookies-local-loader");t||(t=document.createElement("div"),t.id="cookies-local-loader",t.style.cssText=`
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(255, 255, 255, 0.85); z-index: 50; 
                    display: flex; justify-content: center; align-items: center;
                    backdrop-filter: blur(1px); border-radius: inherit;
                `,t.innerHTML=`
                    <div class="spinner-border text-pink" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                `,getComputedStyle(e).position==="static"&&(e.style.position="relative"),e.appendChild(t)),o?(t.classList.remove("d-none"),t.style.display="flex"):(t.classList.add("d-none"),t.style.display="none")},safeAlert:function(o,e){if(window.spa&&typeof window.spa.alert=="function"){window.spa.alert(o,e);return}const t=document.getElementById("spaAlertModal");t?(document.getElementById("spaAlertTitle").innerText=o||"Notice",document.getElementById("spaAlertBody").innerText=e,new bootstrap.Modal(t).show()):alert(`${o}: ${e}`)}};window.cookieManager=c,document.addEventListener("DOMContentLoaded",()=>{c.init();const o=new MutationObserver(t=>{t.forEach(n=>{n.target.id==="page-cookies"&&!n.target.classList.contains("d-none")&&c.fetchCookies()})}),e=document.getElementById("page-cookies");e&&o.observe(e,{attributes:!0,attributeFilter:["class"]})})})();
