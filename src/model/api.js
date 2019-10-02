// 基础链接
// var baseUrl = 'http://198.181.46.148:8080/asset/'
var baseUrl = 'http://127.0.0.1:8080/asset/'
// var baseUrl = 'http://107.175.64.42:8080/asset/'
// Asset 资产 首页数据
var property = 'property/'
// 未使用资产
var unusedProperty = 'unusedProperty/'
// 已借用资产
var borrowedProperty = 'borrowedProperty/'
// 已归还资产
var returnedProperty = 'returnedProperty/'
// 已报废
var scrappedProperty = 'scrappedProperty/'

// 借用资产
var borrow = 'borrow/'

// Location 存放地点
var locale = 'locale/'

// Supplier 供应商
var supplier = 'supplier/'

// department 部门
var department = 'department/'

// 禁用
var disable = 'disable/'

// 资产类别
var propertyClass = 'propertyclass/'
// 报废资产类别
var scrappedPropertyClass = "scrapped/"
var normalPropertyClass = "normal/"

// 品牌
var brand = 'brand/'

//用户
var user = 'user/'

//登录
var login = 'login/'

var api = {
    // 获取所有资产
    getAssetUrl(userId){  return baseUrl + property + userId},
    // 获取未使用资产
    getunusedAssetUrl(userId){return baseUrl + unusedProperty + userId},
    // 获取已借用资产
    getborrowedAssetUrl(userId){return baseUrl + borrowedProperty + userId},
    //已归还资产
    getReturnedPropertyUrl(userId){return baseUrl + returnedProperty + userId},
    //已报废资产
    getScrappedPropertyUrl(userId){return baseUrl + scrappedProperty + userId},

    // 获取存放地点url
    getLocaleUrl(userId) { return baseUrl + locale + userId},
    // 获取供应商url
    getSupplierUrl(userId) { return baseUrl + supplier + userId},
    // 获取部门url
    getDepartmentUrl(userId) { return baseUrl + department + userId},
    // 获取资产借用url
    getAssetBorrowUrl(userId) { return baseUrl + property + borrow + userId},
    // 禁用 存放地点url
    getLocaleDisableUrl() { return baseUrl + locale + disable},
    // 禁用 供应商url
    getSupplierDisableUrl() { return baseUrl + supplier + disable},
    // 禁用 部门url
    getDepartmentDisableUrl() { return baseUrl + department + disable},
    // 获取资产类别
    getPropertyClassUrl(userId) {return baseUrl + propertyClass + userId},
    // 报废资产类别
    getScrappedPropertyClassUrl(userId){return baseUrl + propertyClass + scrappedPropertyClass + userId},
    // 获取品牌url
    getBrandUrl(userId) {return baseUrl + brand + userId},
    // 获取正常资产类别
    getNormalPropertyClassUrl(userId){return baseUrl + propertyClass + normalPropertyClass + userId},

    getUserInformatinUrl: () => baseUrl + user,

    getUserLoginUrl: () => baseUrl + login
}

export default api
