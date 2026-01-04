(function(){const d={list:"/api/cakes",store:"/api/cakes/store",update:"/api/cakes/update",delete:"/api/cakes/delete"},m=()=>document.querySelector('meta[name="csrf-token"]')?.content||"";let l=[],i=null;function r(a){return typeof a!="string"?a:a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}const c={init:function(){this.ensureModalsExist();const a=document.getElementById("cakeImageInput");a&&(a.removeEventListener("change",this.handleImagePreview),a.addEventListener("change",this.handleImagePreview)),console.log("Cake Manager Initialized")},ensureModalsExist:function(){if(document.getElementById("cakeAlertModal"))return;document.body.insertAdjacentHTML("beforeend",`
                <!-- Cake Alert Modal -->
                <div class="modal fade" id="cakeAlertModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                            <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="cakeAlertTitle">Notice</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="cakeAlertBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-dark btn-sm px-4 rounded-pill" data-bs-dismiss="modal">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cake Confirm Modal -->
                <div class="modal fade" id="cakeConfirmModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content border-0 shadow">
                             <div class="modal-header border-bottom-0 pb-0">
                                <h5 class="modal-title fw-bold text-pink" id="cakeConfirmTitle">Confirm</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-center py-4" id="cakeConfirmBody">
                                <!-- Message -->
                            </div>
                            <div class="modal-footer border-top-0 justify-content-center pt-0">
                                <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger btn-sm rounded-pill px-3" id="cakeConfirmBtn">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            `),document.getElementById("cakeConfirmBtn").addEventListener("click",()=>{typeof i=="function"&&i();const e=document.getElementById("cakeConfirmModal");bootstrap.Modal.getInstance(e).hide()})},fetchCakes:async function(){if(document.getElementById("cakesTableBody")){this.toggleLoader(!0);try{const e=await fetch(d.list,{credentials:"same-origin"});if(e.redirected){window.location.href=e.url;return}if(!e.ok)throw new Error("Server Error");const t=await e.json();t.status==="success"&&(l=t.data,this.renderTable(l),this.updateStats(l))}catch(e){console.error("Fetch Error:",e)}finally{this.toggleLoader(!1)}}},renderTable:function(a){const e=document.getElementById("cakesTableBody");if(e.innerHTML="",a.length===0){e.innerHTML=`
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            No cakes found. Add some sweetness!
                        </td>
                    </tr>`;return}a.forEach(t=>{const n=t.status==="active"?'<span class="badge bg-success rounded-pill px-2">Active</span>':'<span class="badge bg-secondary rounded-pill px-2">Inactive</span>',s=`<span class="badge bg-light text-dark border">${r(t.size)}</span>`,o=document.createElement("tr");o.innerHTML=`
                    <td class="ps-4 fw-bold text-pink">${r(t.id)}</td>
                    <td>
                        <img src="${t.image_url||"/assets/footers/logo1.png"}"
                             class="rounded-3 shadow-sm"
                             style="width:50px;height:50px;object-fit:cover;">
                    </td>
                    <td class="fw-semibold">${r(t.name)}</td>
                    <td>${s}</td> 
                    <td class="fw-bold">$${parseFloat(t.price).toFixed(2)}</td>
                    <td>${n}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-secondary rounded-pill me-1"
                            onclick="window.cakeManager.openEditModal('${t.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger rounded-pill"
                            onclick="window.cakeManager.deleteCake('${t.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `,e.appendChild(o)})},updateStats:function(a){const e=(t,n)=>{const s=document.getElementById(t);s&&(s.innerText=n)};e("cake-stat-total",a.length),e("cake-stat-active",a.filter(t=>t.status==="active").length),e("cake-stat-inactive",a.filter(t=>t.status==="inactive").length)},openAddModal:function(){document.getElementById("cakeForm").reset(),document.getElementById("cakeId").value="",document.getElementById("cakeModalTitle").innerText="Add New Cake";const a=document.getElementById("cakePreview");a&&(a.src="/assets/footers/logo1.png"),new bootstrap.Modal(document.getElementById("cakeModal")).show()},openEditModal:function(a){const e=l.find(t=>t.id===a);e&&(document.getElementById("cakeId").value=e.id,document.getElementById("cakeName").value=e.name,document.getElementById("cakePrice").value=e.price,document.getElementById("cakeSize").value=e.size,document.getElementById("cakeStatus").value=e.status,document.getElementById("cakePreview").src=e.image_url,document.getElementById("cakeModalTitle").innerText="Edit Cake ("+e.id+")",new bootstrap.Modal(document.getElementById("cakeModal")).show())},saveCake:async function(){const a=document.getElementById("cakeForm"),e=new FormData(a),t=document.getElementById("cakeId").value,n=t?d.update:d.store;if(!t&&document.getElementById("cakeImageInput").files.length===0){this.safeAlert("Missing Image","Please upload a cake image.");return}this.toggleLoader(!0);try{const o=await(await fetch(n,{method:"POST",credentials:"same-origin",headers:{"X-CSRF-TOKEN":m()},body:e})).json();if(o.status==="success")this.safeAlert("Success",o.message),bootstrap.Modal.getInstance(document.getElementById("cakeModal")).hide(),this.fetchCakes();else{let u=o.message||"An error occurred";o.errors&&(u=Object.values(o.errors).flat().join(`
`)),this.safeAlert("Error",u)}}catch(s){console.error(s),this.safeAlert("Error","Server connection error.")}finally{this.toggleLoader(!1)}},deleteCake:function(a){document.getElementById("cakeConfirmModal")?(document.getElementById("cakeConfirmTitle").innerText="Delete Cake",document.getElementById("cakeConfirmBody").innerText="Are you sure? This cannot be undone.",i=()=>this.proceedDelete(a),new bootstrap.Modal(document.getElementById("cakeConfirmModal")).show()):confirm("Delete this cake?")&&this.proceedDelete(a)},proceedDelete:async function(a){this.toggleLoader(!0);try{const e=new FormData;e.append("id",a);const n=await(await fetch(d.delete,{method:"POST",credentials:"same-origin",headers:{"X-CSRF-TOKEN":m()},body:e})).json();n.status==="success"?(this.safeAlert("Deleted",n.message),this.fetchCakes()):this.safeAlert("Error",n.message)}catch(e){console.error(e)}finally{this.toggleLoader(!1)}},handleImagePreview:function(a){const e=a.target.files[0];if(!e)return;const t=new FileReader;t.onload=function(n){document.getElementById("cakePreview").src=n.target.result},t.readAsDataURL(e)},toggleLoader:function(a){const e=document.getElementById("page-cakes");if(!e)return;let t=document.getElementById("cakes-local-loader");t||(t=document.createElement("div"),t.id="cakes-local-loader",t.style.cssText=`
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(255, 255, 255, 0.85); z-index: 50; 
                    display: flex; justify-content: center; align-items: center;
                    backdrop-filter: blur(1px); border-radius: inherit;
                `,t.innerHTML=`
                    <div class="spinner-border text-pink" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                `,getComputedStyle(e).position==="static"&&(e.style.position="relative"),e.appendChild(t)),a?(t.classList.remove("d-none"),t.style.display="flex"):(t.classList.add("d-none"),t.style.display="none")},safeAlert:function(a,e){const t=document.getElementById("cakeAlertModal");t?(document.getElementById("cakeAlertTitle").innerText=a||"Notice",document.getElementById("cakeAlertBody").innerText=e,new bootstrap.Modal(t).show()):alert(`${a}: ${e}`)}};window.cakeManager=c,document.addEventListener("DOMContentLoaded",()=>{c.init();const a=new MutationObserver(t=>{t.forEach(n=>{n.target.id==="page-cakes"&&!n.target.classList.contains("d-none")&&c.fetchCakes()})}),e=document.getElementById("page-cakes");e&&a.observe(e,{attributes:!0,attributeFilter:["class"]})})})();
