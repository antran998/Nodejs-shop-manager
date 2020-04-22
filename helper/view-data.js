const Navigation = require('../models').navigation;
const Commands = require('../models').command;
const { Op } = require('sequelize');
const Helper = require('./helpful-function');

async function getNavShop() {
    const navigation = await Navigation.findAll({
        where: { route: 'shop' },
        attributes: {
            exclude: [
                'commandId',
                'userCreated',
                'userUpdated',
                'createdAt',
                'updatedAt',
            ],
        },
    });
    return navigation;
}

async function getNavUser(session) {
    let navigation;
    if (session.user.name == '_guest') {
        navigation = await Navigation.findOne({
            where: { route: 'login' },
            attributes: {
                exclude: [
                    'commandId',
                    'userCreated',
                    'userUpdated',
                    'createdAt',
                    'updatedAt',
                ],
            },
        });
        return navigation;
    } else {
        navigation = await Navigation.findOne({
            where: { route: 'logout' },
            attributes: {
                exclude: [
                    'commandId',
                    'userCreated',
                    'userUpdated',
                    'createdAt',
                    'updatedAt',
                ],
            },
        });
        return navigation;
    }
}

async function getNavAdmin(commands) {
    const navigation = await Navigation.findAll({
        include: {
            model: Commands,
            where: {
                id: {
                    [Op.in]: commands,
                },
            },
        },
        attributes: {
            exclude: [
                'commandId',
                'userCreated',
                'userUpdated',
                'createdAt',
                'updatedAt',
            ],
        },
    });

    return navigation.map((nav) => {
        if (nav.command) {
            const newNav = { ...Helper.ConvertToPlain(nav) };
            delete newNav.command;
            return newNav;
        }
    });
}

exports.ViewDataHandler = async (page, session) => {
    let navShop = [];
    let navUser = [];
    let navAdmin = [];
    let showSystem = false;

    navShop = await getNavShop();
    navUser = await getNavUser(session);
    if(session.user.name != '_guest') navAdmin = await getNavAdmin(session.user.commands);
    if(navAdmin.length > 0) showSystem = true;

    return {
        page: page,
        navShop: navShop,
        navUser: navUser,
        navAdmin: navAdmin,
        showSystem: showSystem,
    };
};