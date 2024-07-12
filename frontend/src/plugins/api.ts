const BASE = ""

export function health() {
  return fetch(`${BASE}/api/health`).then((res) => res.json())
}
export function mockStart() {
  return fetch(`${BASE}/api/mock/start`, {
    method: "POST",
  }).then((res) => res.json())
}
export function mockStatus() {
  return fetch(`${BASE}/api/mock/status`).then((res) => res.json())
}
//-----------------API FOR USERS-----------------
export function getUsers(data){
  return fetch(`${BASE}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json())
}
export function getCoupons(id){
  return fetch(`${BASE}/api/coupons/user/${id}`).then((res) => res.json())
}
export function getOrders(id){
  return fetch(`${BASE}/api/orders/user/${id}`).then((res) => res.json())
}
export function delUser(id){
  return fetch(`${BASE}/api/users/del/${id}`, {
    method: "POST",
  }).then((res) => res.json())
}
//-----------------API FOR PRODUCTS-----------------
export function getProducts(options){
  return fetch(`${BASE}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((res) => res.json())
}
export function delProd(id){
  return fetch(`${BASE}/api/products/del/${id}`, {
    method: "POST",
  }).then((res) => res.json())
}
//-----------------API FOR CATEGORIES-----------------
export function getCategories(){
  return fetch(`${BASE}/api/categories`).then((res) => res.json())
}
export function delCat(id){
  return fetch(`${BASE}/api/categories/del/${id}`, {
    method: "POST",
  }).then((res) => res.json())
}
//-----------------API FOR COUPONS-----------------
export function getCouponsList(options){
  return fetch(`${BASE}/api/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((res) => res.json())
}
export function delCoupon(id){
  return fetch(`${BASE}/api/coupons/del/${id}`, {
    method: "POST",
  }).then((res) => res.json())
}
export function couponStats(){
  return fetch(`${BASE}/api/coupons/stats`).then((res) => res.json())
}
export function profilation(id){
  return fetch(`${BASE}/api/categories/profilation/${id}`).then((res) => res.json())
}
export function profilationUpdate(){
  return fetch(`${BASE}/api/categories/profilation/update`,{
    method: "POST",
  }).then((res) => res.json())
}
//-----------------API FOR ORDERS-----------------
export function getOrdersList(options){
  return fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then((res) => res.json())
}
export function delOrder(id){
  return fetch(`${BASE}/api/orders/del/${id}`, {
    method: "POST",
  }).then((res) => res.json())
}
export function orderStats(){
  return fetch(`${BASE}/api/orders/stats`).then((res) => res.json())
}
export function ricevuta(id){
  return fetch(`${BASE}/api/orders/receipt/${id}`).then((res) => res.json())
}
