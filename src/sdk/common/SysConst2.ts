const ana = require('./ApiAndAdminServer');
const AppId = '7cd126ce-a954-4958-8a88-25ffe2260999';
// let AdminServer = 'http://admin.dev.in-store.hk:84'; // DEV
// let AdminServer = 'https://admin.uat.intimex.hk'; // UAT
let AdminServer = ana.AdminServer;
let apiServer = ana.apiServer;
let PayUrl = ana.PayUrl;
let RnpUrl = ana.RnpUrl;
module.exports = {
  // instore app id admin的id
  AppId: AppId, // hongkong taste
  // api server url 統一配置Api服務器的url
  // ApiServer: '/Api', // new uat and production
  // ApiServer: 'http://api.dev.in-store.hk:84', // DEV
  ApiServer: apiServer, // UAT
  // ApiServer: 'https://api.uat.in-store.hk', // Production
  // api version for this app 統一配置Api版本號
  ApiVersion: 'V2',
  // api Authorization 身份认真，用于后端识别客户端
  Authorization: 'N2NkMTI2Y2UtYTk1NC00OTU4LThhODgtMjVmZmUyMjYwOTk5OjQ5ODQyYTQwLWYyMjUtNDQzMS05YzBlLTQ1MjMzYjI1NmJkYg==',
  // admin server url, for login management platform 統一配置admin服務器

  AdminServer: AdminServer,
  // 正常支付地址
  PayUrl: PayUrl,
  // Regnpay支付地址
  RnpUrl: RnpUrl,
  // url '/admin' auto open admin tab
  AutoOpenAdmin: true,
  // admin login url 統一配置admin登錄地址
  AdminLoginUrl: AdminServer + '/default/ClientLogin/' + AppId,
  // 前端默认配置
  FrontE: {
    defaultLang: 'C',
    defaultCurrency: 1,
    mobileBuilding: false,
    pcBuilding: false,
    // 自定義語言列表 ps: 如有添加語言，請在目錄 /src/lang 下添加對應語言包文件和修改index.ts相關設置代碼
    langList: [{
      name: '繁',
      value: 'C'
    }, {
      name: '简',
      value: 'S'
    }, {
      name: 'Eng',
      value: 'E'
    }],
    // 設置是否開啟固定頂部菜單
    // ps: 如開啟，fixedHeader默認獲取DefaultHeader組件，如排版改動不大，可通過組件間傳值showInFixed或css區分控制;
    //     如需重新排版,請在組件內添加相關內容( Eg. <Component> fixedHeader排版內容 </Component>  )
    fixedHeader: true,
    // 手機版側欄滑動菜單設置
    slideMenu: {
      direction: 'right', // 菜單滑出方向 => 默認值 'top', 可選值 'top', 'left', 'right'
      width: '100%', // 菜單寬度 => 默認值'100%'，僅在position值為非'top'的情況生效
      height: '100%', // 菜單高度 => 默認值'100%'，僅在position值為'top'的情況生效
      Embedded: true, // 菜單是否內嵌 => 默認值 false ，僅在position值為非'top'的情況生效
      maskBg: '#000', // 側欄菜單遮罩顏色
      maskOpacity: '.3' // 側欄菜單遮罩顏色透明度
    }
  }
};
