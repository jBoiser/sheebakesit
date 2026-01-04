const T=(function(){let l=[],o=null,h="orders",p=null;const m={orders:"/api/orders",getAllData:"/api/data/all",update:"/api/orders/update",delete:"/api/orders/delete",sendInvoice:"/api/orders/send-invoice",printInvoiceUrl:"/download-invoice/"},b=document.querySelector('meta[name="csrf-token"]')?.content||"";function d(e){return typeof e!="string"?e:e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function w(e){return e?e.startsWith("http")||e.startsWith("/storage")?e:"/storage/"+e.replace(/^\/+/,""):null}async function _(){S(),g("dashboard"),await v(),await O()}function S(){if(document.getElementById("spaAlertModal"))return;document.body.insertAdjacentHTML("beforeend",`
            <!-- Alert Modal -->
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

            <!-- Confirm Modal -->
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
        `),document.getElementById("spaConfirmBtn").addEventListener("click",()=>{p&&p();const s=document.getElementById("spaConfirmModal");bootstrap.Modal.getInstance(s).hide()})}function r(e,s){document.getElementById("spaAlertTitle").innerText=e||"Notice",document.getElementById("spaAlertBody").innerText=s,new bootstrap.Modal(document.getElementById("spaAlertModal")).show()}function u(e,s,t){document.getElementById("spaConfirmTitle").innerText=e||"Confirm",document.getElementById("spaConfirmBody").innerText=s,p=t,new bootstrap.Modal(document.getElementById("spaConfirmModal")).show()}window.toggleSubmenu=function(e,s){const t=document.getElementById(e),n=s.querySelector(".chevron-icon");t.classList.contains("d-none")?(t.classList.remove("d-none"),n?.classList.replace("fa-chevron-right","fa-chevron-down")):(t.classList.add("d-none"),n?.classList.replace("fa-chevron-down","fa-chevron-right"))};function g(e,s=null){h=e,document.querySelectorAll(".spa-view").forEach(t=>t.classList.add("d-none")),document.getElementById("page-"+e)?.classList.remove("d-none"),document.querySelectorAll(".sidebar .nav-link").forEach(t=>t.classList.remove("active")),s?.classList.add("active"),e==="orders"?document.getElementById("refresh-btn")?.classList.remove("d-none"):document.getElementById("refresh-btn")?.classList.add("d-none"),e==="customers"&&D()}async function O(){try{const s=await(await fetch(m.getAllData)).json();if(s.footer){const t=document.getElementById("sidebar-logo"),n=Object.values(s.footer)[0];t&&n&&(t.src=n)}}catch(e){console.error(e)}}async function v(){try{i(!0);const s=await(await fetch(m.orders+"?t="+Date.now())).json();s.status==="success"&&(l=s.data,f(l),y(l))}catch(e){console.error(e)}finally{i(!1)}}function f(e){const s=document.getElementById("ordersTableBody");if(s){if(s.innerHTML="",e.length===0){s.innerHTML='<tr><td colspan="8" class="text-center py-4 text-muted">No orders found.</td></tr>';return}e.forEach(t=>{const n=t.status||"Pending";let a="badge-pending";(n==="Delivered"||n==="Completed")&&(a="badge-delivered"),n==="Cancelled"&&(a="badge-cancelled");let c='<span class="text-muted small">-</span>';t.proof_image&&(c=`
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onclick="spa.openProofModal('${t.proof_image.replace(/'/g,"%27")}')">
                        <i class="fas fa-image"></i> View
                    </button>
                `);const L=document.createElement("tr");L.innerHTML=`
                <td class="fw-bold small">#${d(t.order_id)}</td>
                <td class="fw-bold text-danger">${d(t.reference_no)}</td>
                <td class="small text-muted">${d(k(t.created_at))}</td>
                <td><div class="fw-semibold">${d(t.customer_name)}</div></td>
                <td class="fw-bold">$${parseFloat(t.total_amount).toFixed(2)}</td>
                <td>${c}</td>
                <td><span class="${a} rounded-pill px-2">${d(n)}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border rounded-pill"
                        onclick="spa.viewOrder('${t.order_id}')"> <!-- IDs are usually safe but ideally escape them too if untrusted -->
                        <i class="fas fa-cog"></i> Manage
                    </button>
                </td>
            `,s.appendChild(L)})}}function k(e){if(!e)return"N/A";const s=new Date(e);return s.toLocaleDateString()+" "+s.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function E(){const e=document.getElementById("searchInput").value.toLowerCase(),s=document.getElementById("statusFilter").value,t=l.filter(n=>{const a=n.order_id.toLowerCase().includes(e)||(n.reference_no||"").toLowerCase().includes(e)||(n.customer_name||"").toLowerCase().includes(e),c=!s||n.status===s;return a&&c});f(t)}window.spa={showPage:g,refreshCurrent:v,filterTable:E,viewOrder:x,openProofModal:I,updateOrderStatus:B,deleteCurrentOrder:C,sendInvoice:M,printInvoice:$,confirm:u,alert:r};function x(e){if(o=l.find(n=>n.order_id===e),!o)return;document.getElementById("updateStatusSelect").value=o.status||"Pending";const s=document.getElementById("orderModalBody");let t='<ul class="list-group list-group-flush">';(o.items||[]).forEach(n=>{const a=w(n.image),c=a?`<img src="${a}" class="item-thumb">`:'<div class="item-thumb bg-light"></div>';t+=`
                <li class="list-group-item d-flex align-items-center">
                    ${c}
                    <div class="flex-grow-1 ms-2">
                        <div class="fw-bold">${d(n.name)}</div>
                        <div class="small text-muted">Qty: ${n.qty}</div>
                    </div>
                    <div class="fw-bold">$${parseFloat(n.total).toFixed(2)}</div>
                </li>
            `}),t+="</ul>",s.innerHTML=`
            <div class="row mb-3">
                <div class="col-6">
                    <small class="text-uppercase text-muted">Customer</small>
                    <div class="fw-bold">${d(o.customer_name)}</div>
                    <div class="small"><i class="fas fa-phone-alt me-1"></i> ${d(o.contact)}</div>
                    <div class="small"><i class="fas fa-envelope me-1"></i> ${d(o.email||"No Email")}</div>
                    <div class="small"><i class="fas fa-map-marker-alt me-1"></i> ${d(o.address)}</div>
                </div>

                <div class="col-6 text-end">
                    <small class="text-uppercase text-muted">Order Info</small>
                    <div class="fw-bold text-danger">${d(o.reference_no)}</div>
                    <div class="small">Pay: ${d(o.payment_mode)}</div>
                    <div class="small">Deliver: ${d(o.delivery_mode)}</div>
                    <div class="mt-2 d-flex justify-content-end gap-2">
                        <button class="btn btn-sm btn-outline-dark" onclick="spa.sendInvoice()">
                            <i class="fas fa-envelope"></i> Email PDF
                        </button>
                        <button class="btn btn-sm btn-pink-outline" onclick="spa.printInvoice('${o.order_id}')">
                            <i class="fas fa-file-pdf"></i> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            <h6 class="border-bottom pb-2">Items</h6>
            ${t}

            <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="text-muted small">Comments: ${d(o.comments||"None")}</span>
                <h4 class="text-danger fw-bold m-0">$${parseFloat(o.total_amount).toFixed(2)}</h4>
            </div>
        `,new bootstrap.Modal(document.getElementById("orderModal")).show()}function I(e){if(!e)return;console.log("Opening proof image:",e);const s=w(e),t=document.getElementById("proof-modal-img");t.src=s;const a=t.parentElement.querySelector(".error-msg");a&&a.remove(),t.style.display="inline-block",new bootstrap.Modal(document.getElementById("proofModal")).show()}async function B(){if(!o)return;const e=document.getElementById("updateStatusSelect").value;u("Update Status",`Change status to ${e}?`,async()=>{i(!0);try{const s=new FormData;s.append("order_id",o.order_id),s.append("status",e);const n=await(await fetch(m.update,{method:"POST",headers:{"X-CSRF-TOKEN":b},body:s})).json();if(n.status==="success"){o.status=e;const a=l.findIndex(c=>c.order_id===o.order_id);a!==-1&&(l[a].status=e),f(l),y(l),bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide(),r("Success","Order updated successfully")}else r("Error",n.message||"Error")}catch(s){console.error(s),r("Error","Connection error")}finally{i(!1)}})}async function C(){o&&u("Delete Order","Delete this order? This will remove proof + items.",async()=>{i(!0);try{const e=new FormData;e.append("order_id",o.order_id);const t=await(await fetch(m.delete,{method:"POST",headers:{"X-CSRF-TOKEN":b},body:e})).json();t.status==="success"?(l=l.filter(n=>n.order_id!==o.order_id),f(l),y(l),bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide(),r("Deleted","Order deleted successfully")):r("Error",t.message||"Error")}catch(e){console.error(e),r("Error","Connection error")}finally{i(!1)}})}async function M(){o&&u("Send Invoice","Send invoice PDF to customer email?",async()=>{i(!0);try{const e=new FormData;e.append("order_id",o.order_id);const t=await(await fetch(m.sendInvoice,{method:"POST",headers:{"X-CSRF-TOKEN":b},body:e})).json();t.status==="success"?r("Success","Invoice PDF sent successfully!"):r("Error",t.message||"Error sending invoice")}catch(e){console.error(e),r("Error","Connection error")}finally{i(!1)}})}function $(e){if(!e)return;const s=m.printInvoiceUrl+e;window.open(s,"_blank")}function y(e){document.getElementById("stat-total-orders").innerText=e.length;const s=e.reduce((t,n)=>t+(parseFloat(n.total_amount)||0),0);document.getElementById("stat-total-revenue").innerText="$"+s.toFixed(2),document.getElementById("stat-pending").innerText=e.filter(t=>!t.status||t.status==="Pending").length,document.getElementById("stat-delivered").innerText=e.filter(t=>t.status==="Delivered").length,document.getElementById("stat-completed").innerText=e.filter(t=>t.status==="Completed").length}function D(){const e=document.getElementById("customers-area");if(!e)return;const s={};l.forEach(n=>{const a=(n.customer_name||"Unknown")+"|"+(n.contact||"");s[a]||(s[a]={name:n.customer_name||"Unknown",contact:n.contact||"",email:n.email||"",orders:0}),s[a].orders++});let t='<div class="list-group">';Object.values(s).forEach(n=>{t+=`
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <div class="fw-bold">${d(n.name)}</div>
                        <div class="small text-muted">${d(n.contact)} • ${d(n.email||"No email")}</div>
                    </div>
                    <div class="small text-muted">Orders: ${n.orders}</div>
                </div>
            `}),t+="</div>",e.innerHTML=t}function i(e){const s="page-"+h,t=document.getElementById(s);if(!t){const a=document.getElementById("loader-overlay");a&&a.classList.toggle("d-none",!e);return}let n=document.getElementById("orders-local-loader");n||(n=document.createElement("div"),n.id="orders-local-loader",n.style.cssText=`
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(255, 255, 255, 0.85); z-index: 50;
                display: flex; justify-content: center; align-items: center;
                backdrop-filter: blur(1px); border-radius: inherit;
            `,n.innerHTML=`
                <div class="spinner-border text-pink" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            `,getComputedStyle(t).position==="static"&&(t.style.position="relative"),t.appendChild(n)),e?(n.classList.remove("d-none"),n.style.display="flex"):(n.classList.add("d-none"),n.style.display="none")}return{init:_,showPage:g,refreshCurrent:v,filterTable:E,viewOrder:x,openProofModal:I,updateOrderStatus:B,deleteCurrentOrder:C,sendInvoice:M,printInvoice:$,alert:r,confirm:u}})();document.addEventListener("DOMContentLoaded",()=>{T.init(),window.spaFilter=T.filterTable});
