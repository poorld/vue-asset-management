
# 说明:

## 请求数据类型: 
### 资产管理:
>1.新增资产

>2.修改资产
数据类型:

>3.借用资产
数据类型:
```

```
> 4.删除资产
数据类型:
```
{
	"propertyId":1
}
```
------------------
### 存放地点:
>1.添加存放地点:
```

```
>2.修改存放地点：
```

```
### 供应商
>1.添加供应商:

>2.修改供应商:

### 部门
1.添加部门:

2.修改部门:



### 资产管理:
状态:
-1 未使用(可以借用和报废)
-2 使用中(使用中不可以报废,可以归还)
-3 报废(报废不可以借用)

### 存放地点:
状态:
-1 正常
-2 报废
类型:
-1 固定资产
-2 耗材物品

### 供应商
类型:
-1 生产商
-2 代理商
-3 零件
状态:
-1 正常
-2 报废

### 部门
状态:
-1 正常
-2 已禁用

2.请求数据:

获取资产:
http://localhost:8080/Asset_Management_System/property


添加资产:
http://localhost:8080/Asset_Management_System/property


获取存放地点:
http://localhost:8080/Asset_Management_System/locale

获取供应商:
http://localhost:8080/Asset_Management_System/supplier



### 问题归纳
1.把一个对象中的对象变为空:
比如把对象中的department对象变为空
obj.department = {}
mybatis中,去掉if语句
	<if>
		department_id=#{department.departmentId},
	</if>

2.格式转换 比如 1-正常 2-报废
1.使用:formatter="formatState"
formatStateformatState(row,column){
    let state = row.state == 1 ? '正常' : row.state == 2 ? '报废' : ''
},

mybatis映射对象属性全部为空时，格式为object=null,而前端需要的格式为object=[name=null,age=null,sex=null]
解决办法（暂时没想到更好的方法）
new一个空对象在返回给前端
```
public List<Property> FindallProperty() {
		List<Property> properties = propertyDao.FindallProperty();
		Locale locale = new Locale();
		Supplier supplier = new Supplier();
		Department department = new Department();
		
		for (int i = 0; i < properties.size(); i++){
			Property property = properties.get(i);
			if (property.getLocale() == null){
				property.setLocale(locale);
			}
			if (property.getSupplier() == null){
				property.setSupplier(supplier);
			}
			if (property.getDepartment() == null){
				property.setDepartment(department);
			}
		}
		return properties;
	}
```

404
```
root /var/www/html;

        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ @router;
                index index.html;
        }
        location @router {
                rewrite ^.*$ /index.html last;
        }

```

修改:
添加资产类别、添加品牌
资产添加资产类别、品牌

资产入库只有修改添加、修改功能

3.11资产借用
查看、新增、修改、归还
序号、名称（下拉）、资产编码（下拉）、日期（自生成）、借用部门（下拉）、借用的原因

{
    "errorCode": 0,
    "errorMsg": "成功",
    "data": [
        {
            "propertyId": 1,
            "propertyCode": "20181023154636",
            "propertyName": "电脑显示屏",
            "propertyDate": "2014-10-28",
            "propertyState": 2,
            "propertyDescr": "333",
            "locale": {
                "localeId": 1,
                "localeName": "计算机外围设备",
                "localeType": 1,
                "localeState": 1,
                "localeExplain": "一号仓库"
            },
            "supplier": {
                "supplierId": 1,
                "supplierApellation": "服务器采购商",
                "supplierType": 1,
                "supplierState": 1,
                "supplierName": "王先生",
                "supplierPhone": "13542569845",
                "supplierAddress": "北京市海淀区"
            },
            "department": {
                "departmentId": 1,
                "departmentCode": "10010",
                "departmentName": "软件开发部",
                "departmentState": 1
            },
            "propertyClass": {
                "propertyClassId": 1,
                "propertyClassCode": "20181024",
                "propertyClassName": "哒哒类别",
                "propertyClassState": 1
            },
            "brand": {
                "brandId": 2,
                "brandCode": "20181024",
                "brandName": "安踏",
                "brandState": 1
            }
        },
        {
            "propertyId": 2,
            "propertyCode": "20181023154324",
            "propertyName": "鼠标键盘一套",
            "propertyDate": "2014-10-28",
            "propertyState": 2,
            "propertyDescr": null,
            "locale": {
                "localeId": 2,
                "localeName": "服务器采购商存储",
                "localeType": 1,
                "localeState": 1,
                "localeExplain": "二号仓库"
            },
            "supplier": {
                "supplierId": 2,
                "supplierApellation": "笔记本电脑采购商",
                "supplierType": 2,
                "supplierState": 1,
                "supplierName": "王尼玛",
                "supplierPhone": "17878365395",
                "supplierAddress": "广西北海"
            },
            "department": {
                "departmentId": 2,
                "departmentCode": "10011",
                "departmentName": "产品销售部",
                "departmentState": 1
            },
            "propertyClass": {
                "propertyClassId": 2,
                "propertyClassCode": "20181024",
                "propertyClassName": "小小个类别",
                "propertyClassState": 1
            },
            "brand": {
                "brandId": 2,
                "brandCode": "20181024",
                "brandName": "安踏",
                "brandState": 1
            }
        },
        {
            "propertyId": 7,
            "propertyCode": "20181023155333",
            "propertyName": "哒哒333",
            "propertyDate": "2018-10-25",
            "propertyState": 1,
            "propertyDescr": "哒哒",
            "locale": {
                "localeId": 3,
                "localeName": "笔记本电脑一台",
                "localeType": 2,
                "localeState": 1,
                "localeExplain": "三号仓库"
            },
            "supplier": {
                "supplierId": 5,
                "supplierApellation": "哒哒零件",
                "supplierType": 3,
                "supplierState": 1,
                "supplierName": "哒哒",
                "supplierPhone": "15234325435",
                "supplierAddress": "广西职业技术学院"
            },
            "department": {
                "departmentId": null,
                "departmentCode": null,
                "departmentName": null,
                "departmentState": null
            },
            "propertyClass": {
                "propertyClassId": 1,
                "propertyClassCode": "20181024",
                "propertyClassName": "哒哒类别",
                "propertyClassState": 1
            },
            "brand": {
                "brandId": 1,
                "brandCode": "20181024",
                "brandName": "耐克",
                "brandState": 1
            }
        }
    ]
}
# vue-asset-management
