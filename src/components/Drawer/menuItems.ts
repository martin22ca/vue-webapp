export interface MenuItem {
    title: string;
    icon: string;
    route: string;
    children: MenuItem[] | undefined;
}

export const Items: Array<MenuItem> = [
    {
        title: 'DB Prevencion',
        icon: 'mdi:database',
        route: '/recordsDB',
        children: undefined
    },
    {
        title: 'Expedientes',
        icon: 'bx:file',
        route: '/recordsMain',
        children: undefined
    },
    {
        title: 'Prestadores',
        icon: 'icon-park-outline:delivery',
        route: '/providers',
        children: undefined
    },
    {
        title: 'Auditor',
        icon: 'mdi:face-agent',
        route: '/audit',
        children: [
            {
                title: 'Asignado',
                icon: 'mdi:file-check-outline',
                route: '/audit/',
                children: undefined
            }]
    },
    {
        title: 'Entradas',
        icon: 'ic:round-log-in',
        route: '/input',
        children: [
            {
                title: 'Carga DB',
                icon: 'mingcute:upload-line',
                route: '/input/',
                children: undefined
            },
            {
                title: 'Carga Manual',
                icon: 'mdi:grid',
                route: '/input/manual',
                children: undefined
            },
            {
                title: 'Lotes',
                icon: 'mdi:land-plots',
                route: '/input/lots',
                children: undefined
            },
        ],
    },
    {
        title: 'Egreso',
        icon: 'ic:round-log-out',
        route: '/records',
        children: [
            {
                title: 'Egreso',
                icon: 'ic:round-log-out',
                children: undefined,
                route: '/records',
            },
            {
                title: 'Egreso',
                icon: 'ic:round-log-out',
                route: '/records',
                children: undefined
            }
        ],
    },
    {
        title: 'Coordinador',
        icon: 'material-symbols:groups',
        route: '/management',
        children: [
            {
                title: 'Usuarios',
                icon: 'ph:users',
                route: '/management/users',
                children: undefined
            },
            {
                title: 'Roles',
                icon: 'mdi:lock-pattern',
                route: '/management/roles',
                children: undefined
            },
        ]
    },

]