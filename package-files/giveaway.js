"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.giveawaySystem = void 0;
const discord_js_1 = require("discord.js");
const {ButtonBuilder, ActionRowBuilder, ButtonStyle} =  require("discord.js")
const chalk_1 = __importDefault(require("chalk"));
const gSys_1 = __importDefault(require("./model/gSys"));
// ------------------------------
// ------ F U N C T I O N -------
// ------------------------------
/**
 * A **Powerful** yet simple giveawaySystem | *Required: **manageBtn()***
 * @param client
 * @param message
 * @param options
 * @link `Documentation:` ***https://simplyd.js.org/docs/Systems/givewaySystem***
 * @example simplydjs.giveawaySystem(client, message)
 */
function giveawaySystem(client, message, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36;
            try {
                let interaction;
                if (message.commandId) {
                    interaction = message;
                }
                const timeStart = Date.now();
                const int = message;
                const mes = message;
                let roly;
                if (options.manager)
                    roly = yield message.member.roles.cache.find((r) => r.id === options.manager.id);
                else if (options.manager)
                    roly = yield message.member.roles.cache.find((r) => r.id === options.manager);
                if (!(roly ||
                    ((_b = (_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.has(discord_js_1.PermissionFlagsBits.Administrator)))) {
                    return message.channel.send({
                        content: 'You Must Have • Administrator Permission (or) • Giveaway Manager Role'
                    });
                }
                (_c = options.winners) !== null && _c !== void 0 ? _c : (options.winners = 1);
                options.buttons = {
                    enter: {
                        style: ((_e = (_d = options.buttons) === null || _d === void 0 ? void 0 : _d.enter) === null || _e === void 0 ? void 0 : _e.style) || ButtonStyle.Success,
                        label: ((_g = (_f = options.buttons) === null || _f === void 0 ? void 0 : _f.enter) === null || _g === void 0 ? void 0 : _g.label) || '0',
                        emoji: ((_j = (_h = options.buttons) === null || _h === void 0 ? void 0 : _h.enter) === null || _j === void 0 ? void 0 : _j.emoji) || '🎁'
                    },
                    end: {
                        style: ((_l = (_k = options.buttons) === null || _k === void 0 ? void 0 : _k.end) === null || _l === void 0 ? void 0 : _l.style) ||ButtonStyle.Danger,
                        label: ((_o = (_m = options.buttons) === null || _m === void 0 ? void 0 : _m.end) === null || _o === void 0 ? void 0 : _o.label) || 'End',
                        emoji: ((_q = (_p = options.buttons) === null || _p === void 0 ? void 0 : _p.end) === null || _q === void 0 ? void 0 : _q.emoji) || '⛔'
                    },
                    reroll: {
                        style: ((_s = (_r = options.buttons) === null || _r === void 0 ? void 0 : _r.end) === null || _s === void 0 ? void 0 : _s.style) || ButtonStyle.Primary,
                        label: ((_u = (_t = options.buttons) === null || _t === void 0 ? void 0 : _t.end) === null || _u === void 0 ? void 0 : _u.label) || 'Reroll',
                        emoji: ((_w = (_v = options.buttons) === null || _v === void 0 ? void 0 : _v.end) === null || _w === void 0 ? void 0 : _w.emoji) || '🔁'
                    }
                };
                if (!options.embed) {
                    options.embed = {
                        footer: {
                            text: 'Giveaway System',
                            iconURL: 'https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256'
                        },
                        color: '#075FFF',
                        title: 'Giveaways',
                        credit: true
                    };
                }
                let ch;
                let time;
                let winners;
                let prize;
                let req = 'None';
                let gid;
                let content = '** **';
                if (options.ping) {
                    content = message.guild.roles
                        .fetch(options.ping, { force: true })
                        .toString();
                }
                let val;
                if (((_x = options.req) === null || _x === void 0 ? void 0 : _x.type) === 'Role') {
                    val = yield message.guild.roles.fetch((_y = options.req) === null || _y === void 0 ? void 0 : _y.id, {
                        force: true
                    });
                    req = 'Role';
                }
                else if (((_z = options.req) === null || _z === void 0 ? void 0 : _z.type) === 'Guild') {
                    val = client.guilds.cache.get((_0 = options.req) === null || _0 === void 0 ? void 0 : _0.id);
                    if (!val)
                        return message.channel.send({
                            content: 'Please add me to that server so i can set the requirement.'
                        });
                    gid = val.id;
                    yield val.invites.fetch().then((a) => {
                        val = `[${val.name}](https://discord.gg/${a.first()})`;
                    });
                    req = 'Guild';
                }
                if (interaction) {
                    ch =
                        options.channel ||
                            int.options.getChannel('channel') ||
                            interaction.channel;
                    time = options.time || int.options.getString('time') || '1h';
                    winners = options.winners || int.options.getNumber('winners');
                    prize = options.prize || int.options.getString('prize');
                }
                else if (!interaction) {
                    const [...args] = mes.content.split(/ +/g);
                    ch =
                        options.channel ||
                            // @ts-ignore
                            message.mentions.channels.first() ||
                            message.channel;
                    time = options.time || args[1] || '1h';
                    winners = args[2] || options.winners;
                    prize = options.prize || args.slice(3).join(' ');
                }
                const enter = new discord_js_1.ButtonBuilder()
                    .setCustomId('enter_giveaway')
                    .setStyle(((_2 = (_1 = options.buttons) === null || _1 === void 0 ? void 0 : _1.enter) === null || _2 === void 0 ? void 0 : _2.style) || ButtonStyle.Success);
                if (options.disable === 'Label')
                    enter.setEmoji(((_4 = (_3 = options.buttons) === null || _3 === void 0 ? void 0 : _3.enter) === null || _4 === void 0 ? void 0 : _4.emoji) || '🎁');
                else if (options.disable === 'Emoji')
                    enter.setLabel(((_6 = (_5 = options.buttons) === null || _5 === void 0 ? void 0 : _5.enter) === null || _6 === void 0 ? void 0 : _6.label) || '0');
                else {
                    enter
                        .setEmoji(((_8 = (_7 = options.buttons) === null || _7 === void 0 ? void 0 : _7.enter) === null || _8 === void 0 ? void 0 : _8.emoji) || '🎁')
                        .setLabel(((_10 = (_9 = options.buttons) === null || _9 === void 0 ? void 0 : _9.enter) === null || _10 === void 0 ? void 0 : _10.label) || '0');
                }
                const end = new discord_js_1.ButtonBuilder()
                    .setCustomId('end_giveaway')
                    .setStyle(((_12 = (_11 = options.buttons) === null || _11 === void 0 ? void 0 : _11.end) === null || _12 === void 0 ? void 0 : _12.style) || ButtonStyle.Danger);
                if (options.disable === 'Label')
                    end.setEmoji(((_14 = (_13 = options.buttons) === null || _13 === void 0 ? void 0 : _13.end) === null || _14 === void 0 ? void 0 : _14.emoji) || '⛔');
                else if (options.disable === 'Emoji')
                    end.setLabel(((_16 = (_15 = options.buttons) === null || _15 === void 0 ? void 0 : _15.end) === null || _16 === void 0 ? void 0 : _16.label) || 'End');
                else {
                    end
                        .setEmoji(((_18 = (_17 = options.buttons) === null || _17 === void 0 ? void 0 : _17.end) === null || _18 === void 0 ? void 0 : _18.emoji) || '⛔')
                        .setLabel(((_20 = (_19 = options.buttons) === null || _19 === void 0 ? void 0 : _19.end) === null || _20 === void 0 ? void 0 : _20.label) || 'End');
                }
                const reroll = new discord_js_1.ButtonBuilder()
                    .setCustomId('reroll_giveaway')
                    .setStyle(((_22 = (_21 = options.buttons) === null || _21 === void 0 ? void 0 : _21.reroll) === null || _22 === void 0 ? void 0 : _22.style) || ButtonStyle.Success)
                    .setDisabled(true);
                if (options.disable === 'Label')
                    reroll.setEmoji(((_24 = (_23 = options.buttons) === null || _23 === void 0 ? void 0 : _23.reroll) === null || _24 === void 0 ? void 0 : _24.emoji) || '🔁');
                else if (options.disable === 'Emoji')
                    reroll.setLabel(((_26 = (_25 = options.buttons) === null || _25 === void 0 ? void 0 : _25.reroll) === null || _26 === void 0 ? void 0 : _26.label) || 'Reroll');
                else {
                    reroll
                        .setEmoji(((_28 = (_27 = options.buttons) === null || _27 === void 0 ? void 0 : _27.reroll) === null || _28 === void 0 ? void 0 : _28.emoji) || '🔁')
                        .setLabel(((_30 = (_29 = options.buttons) === null || _29 === void 0 ? void 0 : _29.reroll) === null || _30 === void 0 ? void 0 : _30.label) || 'Reroll');
                }
                const row = new discord_js_1.ActionRowBuilder().addComponents([enter, reroll, end]);
                time = ms(time);
                const endtime = Number((Date.now() + time).toString().slice(0, -3));
                options.fields = options.fields || [
                    {
                        name: 'Prize',
                        value: `{prize}`
                    },
                    {
                        name: 'Hosted By',
                        value: `{hosted}`,
                        inline: true
                    },
                    {
                        name: 'Ends at',
                        value: `{endsAt}`,
                        inline: true
                    },
                    { name: 'Winner(s)', value: `{winCount}`, inline: true },
                    {
                        name: 'Requirements',
                        value: `{requirements}`
                    }
                ];
                (_31 = options.fields) === null || _31 === void 0 ? void 0 : _31.forEach((a) => {
                    a.value = a === null || a === void 0 ? void 0 : a.value.replaceAll('{hosted}', `<@${message.member.user.id}>`).replaceAll('{endsAt}', `<t:${endtime}:f>`).replaceAll('{prize}', prize).replaceAll('{requirements}', req === 'None'
                        ? 'None'
                        : req + ' | ' + (req === 'Role' ? `${val}` : val)).replaceAll('{winCount}', winners).replaceAll('{entered}', '0');
                });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle((((_32 = options.embed) === null || _32 === void 0 ? void 0 : _32.title) || 'Giveaway')
                    .replaceAll('{hosted}', `<@${message.member.user.id}>`)
                    .replaceAll('{prize}', prize)
                    .replaceAll('{endsAt}', `<t:${endtime}:R>`)
                    .replaceAll('{requirements}', req === 'None'
                    ? 'None'
                    : req + ' | ' + (req === 'Role' ? `${val}` : val))
                    .replaceAll('{winCount}', winners)
                    .replaceAll('{entered}', '0') || prize)
                    .setColor(((_33 = options.embed) === null || _33 === void 0 ? void 0 : _33.color) || '#2f3136')
                    .setTimestamp(Number(Date.now() + time))
                    .setFooter(((_34 = options.embed) === null || _34 === void 0 ? void 0 : _34.credit) === false
                    ? (_35 = options.embed) === null || _35 === void 0 ? void 0 : _35.footer
                    : {
                        text: 'Giveaway System',
                        iconURL: 'https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256'
                    })
                    .setDescription((((_36 = options.embed) === null || _36 === void 0 ? void 0 : _36.description))
                    .replaceAll('{hosted}', `<@${message.member.user.id}>`)
                    .replaceAll('{prize}', prize)
                    .replaceAll('{endsAt}', `<t:${endtime}:R>`)
                    .replaceAll('{winCount}', winners))
                    .addFields(options.fields);
                yield ch
                    .send({ content: content, embeds: [embed], components: [row] })
                    .then((msg) => __awaiter(this, void 0, void 0, function* () {
                    var _37;
                    resolve({
                        message: msg.id,
                        winners: winners,
                        prize: prize,
                        endsAt: endtime,
                        req: req === 'None'
                            ? 'None'
                            : req + ' | ' + (req === 'Role' ? val : gid)
                    });
                    const link = new discord_js_1.ButtonBuilder()
                        .setLabel('View Giveaway.')
                        .setStyle(ButtonStyle.Link)
                        .setURL(msg.url);
                    const rowew = new discord_js_1.ActionRowBuilder().addComponents([link]);
                    if (int && interaction) {
                        yield int.reply({
                            content: 'Giveaway has started.',
                            components: [rowew]
                        });
                    }
                    else
                        yield message.channel.send({
                            content: 'Giveaway has started.',
                            components: [rowew]
                        });
                    const tim = Number(Date.now() + time);
                    const crete = new gSys_1.default({
                        message: msg.id,
                        entered: 0,
                        winCount: winners,
                        desc: ((_37 = options.embed) === null || _37 === void 0 ? void 0 : _37.description) || null,
                        requirements: {
                            type: req === 'None' ? 'none' : req.toLowerCase(),
                            id: req === 'Role' ? val : gid
                        },
                        started: timeStart,
                        prize: prize,
                        entry: [],
                        endTime: tim,
                        host: message.member.user.id
                    });
                    yield crete.save();
                    const timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        if (!msg)
                            return;
                        const allComp = yield (msg === null || msg === void 0 ? void 0 : msg.components[0]);
                        const dt = yield gSys_1.default.findOne({ message: msg.id });
                        if (dt.endTime && Number(dt.endTime) < Date.now()) {
                            const embeded = new discord_js_1.EmbedBuilder()
                                .setTitle('Processing Data...')
                                .setColor(0xcc0000)
                                .setDescription(`Please wait.. We are Processing the winner with some magiks`)
                                .setFooter({
                                text: 'Ending the Giveaway, Scraping the ticket..'
                            });
                            clearInterval(timer);
                            yield msg
                                .edit({ embeds: [embeded], components: [] })
                                .catch(() => { });
                            const dispWin = [];
                            const winArr = [];
                            const winCt = dt.winCount;
                            const entries = dt.entry;
                            for (let i = 0; i < winCt; i++) {
                                const winno = Math.floor(Math.random() * dt.entered);
                                winArr.push(entries[winno]);
                            }
                            setTimeout(() => {
                                winArr.forEach((name) => __awaiter(this, void 0, void 0, function* () {
                                    yield message.guild.members
                                        .fetch(name === null || name === void 0 ? void 0 : name.userID)
                                        .then((user) => {
                                        var _a, _b;
                                        dispWin.push(`<@${user.user.id}>`);
                                        const embod = new discord_js_1.EmbedBuilder()
                                            .setTitle('You.. Won the Giveaway !')
                                            .setDescription(`You just won \`${dt.prize}\` in the Giveaway at \`${user.guild.name}\` Go claim it fast !`)
                                            .setColor(0x075fff)
                                            .setFooter(((_a = options.embed) === null || _a === void 0 ? void 0 : _a.credit) === false
                                            ? (_b = options.embed) === null || _b === void 0 ? void 0 : _b.footer
                                            : {
                                                text: 'Giveaway System',
                                                iconURL: 'https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256'
                                            });
                                        const gothe = new discord_js_1.ButtonBuilder()
                                            .setLabel('View Giveaway')
                                            .setStyle('LINK')
                                            .setURL(msg.url);
                                        const entrow = new discord_js_1.ActionRowBuilder().addComponents([
                                            gothe
                                        ]);
                                        return user
                                            .send({ embeds: [embod], components: [entrow] })
                                            .catch(() => { });
                                    })
                                        .catch(() => { });
                                }));
                            }, 2000);
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                var _38, _39, _40, _41, _42;
                                if (!dt)
                                    return yield msg.delete();
                                if (dt) {
                                    const tim = Number(dt.endTime.slice(0, -3));
                                    const f = [];
                                    if (options.fields) {
                                        options.fields.forEach((a) => {
                                            a.value = a.value
                                                .replaceAll('{hosted}', `<@${dt.host}>`)
                                                .replaceAll('{endsAt}', `<t:${tim}:f>`)
                                                .replaceAll('{prize}', dt.prize.toString())
                                                .replaceAll('{requirements}', req === 'None'
                                                ? 'None'
                                                : req + ' | ' + (req === 'Role' ? `${val}` : val))
                                                .replaceAll('{winCount}', dt.winCount.toString())
                                                .replaceAll('{entered}', dt.entered.toString());
                                            f.push(a);
                                        });
                                    }
                                    if (dt.entered <= 0 || !winArr[0]) {
                                        embed
                                            .setTitle('No one entered')
                                            .setFields(f)
                                            .setColor('RED')
                                            .setFooter(((_38 = options.embed) === null || _38 === void 0 ? void 0 : _38.credit) === false
                                            ? (_39 = options.embed) === null || _39 === void 0 ? void 0 : _39.footer
                                            : {
                                                text: 'Giveaway System',
                                                iconURL: 'https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256'
                                            });
                                        return yield msg.edit({
                                            embeds: [embed],
                                            components: []
                                        });
                                    }
                                    embed
                                        .setTitle('We got the winner !')
                                        .setDescription(`${dispWin.join(', ')} got the prize !\n\n` +
                                        (((_40 = options.embed) === null || _40 === void 0 ? void 0 : _40.description) ||
                                            `Interact with the giveaway using the buttons.`)
                                            .replaceAll('{hosted}', `<@${dt.host}>`)
                                            .replaceAll('{prize}', dt.prize)
                                            .replaceAll('{endsAt}', `<t:${dt.endTime}:R>`)
                                            .replaceAll('{requirements}', req === 'None'
                                            ? 'None'
                                            : req + ' | ' + (req === 'Role' ? `${val}` : val))
                                            .replaceAll('{winCount}', dt.winCount.toString())
                                            .replaceAll('{entered}', dt.entered.toString()))
                                        .setFields(options.fields)
                                        .setColor(0x3bb143)
                                        .setFooter(((_41 = options.embed) === null || _41 === void 0 ? void 0 : _41.credit) === false
                                        ? (_42 = options.embed) === null || _42 === void 0 ? void 0 : _42.footer
                                        : {
                                            text: 'Giveaway System',
                                            iconURL: 'https://cdn.discordapp.com/app-icons/928883516391960636/01504a01c7878e2e6fa813a54d8b055c.png?size=256'
                                        });
                                    allComp.components[0].disabled = true;
                                    allComp.components[1].disabled = false;
                                    allComp.components[2].disabled = true;
                                    yield msg.edit({
                                        embeds: [embed],
                                        components: [allComp]
                                    });
                                }
                            }), 5200);
                        }
                    }), 5000);
                }));
            }
            catch (err) {
                console.log(`${chalk_1.default.red('Error Occured.')} | ${chalk_1.default.magenta('giveaway')} | Error: ${err.stack}`);
            }
        }));
    });
}
exports.giveawaySystem = giveawaySystem;
function ms(str) {
    let sum = 0, time, type, val;
    const arr = ('' + str)
        .split(' ')
        .filter((v) => v != '' && /^(\d{1,}\.)?\d{1,}([wdhms])?$/i.test(v));
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        time = arr[i];
        type = time.match(/[wdhms]$/i);
        if (type) {
            val = Number(time.replace(type[0], ''));
            switch (type[0].toLowerCase()) {
                case 'w':
                    sum += val * 604800000;
                    break;
                case 'd':
                    sum += val * 86400000;
                    break;
                case 'h':
                    sum += val * 3600000;
                    break;
                case 'm':
                    sum += val * 60000;
                    break;
                case 's':
                    sum += val * 1000;
                    break;
            }
        }
        else if (!isNaN(parseFloat(time)) && isFinite(parseFloat(time))) {
            sum += parseFloat(time);
        }
    }
    return sum;
}
