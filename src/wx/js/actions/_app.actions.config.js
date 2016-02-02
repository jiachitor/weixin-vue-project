const appActionsConfig = {
    login:{
        tip:'login',
        extend:[{
            eventNmae: 'signin',
            title:'SIGNIN',
            type:'post',
            api:'/admin/api/signin'
        },{
            eventNmae: 'loadLocale',
            title:'LOADLOCALE',
            type:'get',
            api:'/admin/api/locales.json'
        }]
    },
    app:{
        tip:'app',
        fetch:{
            load:{
                title:'LOAD',
                api:'/app/js/data/list.json',
                store:'upload'
            },
            add:{
                title:'ADD',
                api:'/admin/api/upload/image'
            },
            update:{
                title:'UPDATE',
                api:''
            },
            del:{
                title:'DEL',
                api:'/admin/api/del/image',
                store:'upload'
            },
            sort:{
                title:'SORT',
                api:''
            }
        },
        extend:[{
            eventNmae: 'loadlist',
            title:'LOADLIST',
            type:'get',
            api:'/admin/api/get/image',
            store:'upload'
        },{
            eventNmae: 'loadLocales',
            title:'LOADLOCALES',
            type:'get',
            api:'/admin/api/locales.json',
            store:'home'
        }]
    },
}

export default appActionsConfig
