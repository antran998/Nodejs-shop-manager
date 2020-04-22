const Commands = require('../models').command;
const Roles = require('../models').role;
const { Op } = require('sequelize');

async function getRoles(user) {
    const roles = await user.getRoles({ attributes: ['id'] });
    return roles.map((role) => {
        return role.id;
    });
}

async function getCommands(roles) {
    const commands = await Commands.findAll({
        include: {
            model: Roles,
            where: {
                id: {
                    [Op.in]: roles,
                },
            },
        },
    });
    return commands.map((command) => {
        if (command.roles.length > 0) return command.id;
    });
}

exports.SessionDataHandler = async (user) => {
    const roles = user.name != '_guest' ? await getRoles(user) : [];
    const commands = await getCommands(roles);

    return {
        id: user.id,
        name: user.name,
        roles: roles,
        commands: commands
    };
};