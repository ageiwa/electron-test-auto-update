import {
    RouteRecordRaw,
    RouteRecordName,
    createRouter,
    createWebHistory
} from 'vue-router'
import { getAccount, disconnect } from '@wagmi/core'
import { useUserStore } from '@/entities/User/model'
import { clientConfig } from '@/shared/utils/clientConfig'

const accountManagerRoutes = [
    {
        path: '/accounts/evm',
        name: 'EVMWallets',
        component: () => import('@/pages/EVMWallets/EVMWallets.vue'),
        redirect: '/accounts/evm/wallets',
        meta: {
            activeRoutes: [
                'AccountManager'
            ]
        },
        children: [
            {
                path: '/accounts/evm/wallets',
                name: 'Wallets',
                component: () => import('@/pages/Wallets/Wallets.vue'),
                meta: {
                    activeRoutes: [
                        'EVMWallets',
                        'AccountManager'
                    ]
                }
            },
            {
                path: '/accounts/evm/proxies',
                name: 'Proxies',
                component: () => import('@/pages/Proxies/Proxies.vue'),
                meta: {
                    activeRoutes: [
                        'EVMWallets',
                        'AccountManager'
                    ]
                }
            }
        ]
    }
]

const checkersRoutes = [
    {
        path: '/checkers/balances',
        name: 'Balances',
        component: () => import('@/pages/Balances/Balances.vue'),
        meta: {
            activeRoutes: [
                'Checkers'
            ]
        },
        children: [
            {
                path: '/checkers/balances/zksync',
                name: 'ZKsync',
                component: () => import('@/pages/ZKsyncPage/ZKsyncPage.vue'),
                meta: {
                    activeRoutes: [
                        'Checkers',
                        'Balances'
                    ]
                }
            },
        ],
        redirect: '/checkers/balances/zksync'
    }
]

const mainRoutes = [
    {
        path: '/accounts',
        name: 'AccountManager',
        component: () => import('@/pages/AccountManager/AccountManager.vue'),
        children: accountManagerRoutes,
        redirect: '/accounts/evm/wallets'
    },
    {
        path: '/exchange',
        name: 'ExchangeManager',
        component: () => import('@/pages/ExchangeManager/ExchangeManager.vue'),
    },
    {
        path: '/modules',
        name: 'Modules',
        component: () => import('@/pages/Modules/Modules.vue'),
    },
    {
        path: '/Settings',
        name: 'Settings',
        component: () => import('@/pages/Setings/Setings.vue'),
    },
    {
        path: '/exchange',
        name: 'ExchangeManager',
        component: () => import('@/pages/ExchangeManager/ExchangeManager.vue'),
    },
    {
        path: '/faq',
        name: 'FAQ',
        component: () => import('@/pages/FAQ/FAQ.vue'),
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/pages/Projects/Projects.vue'),
    },
    {
        path: '/projects/:id',
        name: 'AboutProject',
        component: () => import('@/pages/AboutProject/AboutProject.vue'),
        meta: {
            activeRoutes: [
                'Projects'
            ]
        }
    },
    {
        path: '/referral',
        name: 'Referral',
        component: () => import('@/pages/Referral/Referral.vue'),
    },
    {
        path: '/checkers',
        name: 'Checkers',
        component: () => import('@/pages/Checkers/Checkers.vue'),
        children: checkersRoutes,
        redirect: '/checkers/balances/zksync'
    },
    {
        path: '/connect',
        name: 'Connect',
        component: () => import('@/pages/Auth/Auth.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Auth/Auth.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/Auth/Auth.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'MainPage',
            component: () => import('@/pages/MainPage/MainPage.vue'),
            children: mainRoutes as RouteRecordRaw[],
            redirect: '/accounts/evm/wallets'
        },
    ]
})

router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    const authRouteNames: RouteRecordName[] = ['Login', 'Register']
    const isConnectRoute = to.name === 'Connect'
    const isAuthRoute = to.name && authRouteNames.includes(to.name)

    if (userStore.user.isAuth && isAuthRoute) {
        return { name: 'MainPage' }
    }

    if (!userStore.user.isAuth && isAuthRoute) {
        const account = getAccount(clientConfig)

        if (account.address) {
            return true
        }

        return { name: 'Connect' }
    }

    if (!userStore.user.isAuth && !isConnectRoute) {
        return { name: 'Connect' }
    }

    if (to.name === 'Connect' && from.name === 'Login' || to.name === 'Connect' && from.name === 'Register') {
        try {
            await disconnect(clientConfig)
            return true
        }
        catch (err) {
            return { name: from.name }
        }
    }
    
    return true
})

export default router