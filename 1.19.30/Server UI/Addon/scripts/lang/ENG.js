import { Scoreboard, world } from "mojang-minecraft";
import { ActionFormData, ModalFormData } from "mojang-minecraft-ui";
/** ------------------- */
/** Settings Here */
let money_scoreboard = "money"; /** Name of Scorebaord Money */
let bank_scoreboard = "bank"; /** Name of Scorebaord Bank */

let movestep = 10; /** Enter a step to move the number, for example if you enter 10 it will be 0 10 20 30 40.. | Enter 5 it will be 0 5 10 15 20 25.. */
/** ------------------- */
function getScore(objective, target, useZero = true) {
    try {
        const obj = world.scoreboard.getObjective(objective)
        if (typeof target == 'string') {
            return obj.getScore(obj.getParticipants().find(v => v.displayName == target))
        }
        return obj.getScore(target.scoreboard)
    } catch {
        return useZero ? 0 : NaN
    }
}
/** ------------------- */
try {
	world.events.beforeItemUse.subscribe((data) => {
		let pl = data.source
		let item = data.item

		if (item.id === "minecraft:clock" && pl.hasTag("eng")) {
			menu(pl)
		}
	})
} catch (e) {
	world.getDimension('overworld').runCommand(`tell @s §4Error:§f ${e}`)
}
/** ------------------- */
function menu(pl)	{
	let form = new ActionFormData();
	form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
	form.body(`Hi! §c${pl.name}§f, Welcome to Server Menu\nLet §csee§f what do you want?`);
	form.button(`§8Lobby/Hub`);
	form.button(`§8Bank`);
	form.button(`§8Player Details`);
	form.button(`§8Lang`);
	form.show(pl).then((res) => {
		if(res.selection === 0)	{
			/** You Can TYPE Lobby 'XYZ' Down Here  */
			pl.runCommand(`tp @s 0 -60 0`)
		}
		if(res.selection === 1)	{
			/** !Don't Edit if you don't know what are you doing! */
			bank(pl)
		}
		if(res.selection === 2)	{
			/** !Don't Edit if you don't know what are you doing! */
			details(pl)
		}
		if(res.selection === 3)	{
			/** !Don't Edit if you don't know what are you doing! */
			lang(pl)
		}
    });
}
/** ------------------- */
/** !Don't Edit if you don't know what are you doing! */
function details(pl)	{
    pl.runCommand(`playsound random.pop @s ~~~ 50`);
    let form = new ActionFormData();
    let players = [...world.getPlayers()];
    form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
    form.body(`Player Online: ${players.length} \nAll §cPlayer§f In This Server..`);
    players.map(function (player) {
        let randoms = Math.floor(Math.random() * 2);
        if (randoms == 0) {
            form.button(`${player.name}`, "textures/ui/icon_alex");
        }
        if (randoms == 1) {
            form.button(`${player.name}`, "textures/ui/icon_steve");
        }
    });
    form.show(pl).then((res) => {
        if (res.isCanceled)
            return;
		return menu(pl)
    });
}
/** ------------------- */
function bank(pl)	{
	pl.runCommand(`playsound random.pop @s ~~~ 50`);
	let form = new ActionFormData();
	form.title(`§e»§c ${pl.name}'s §fInterface §e«`);
	form.body(`§fWelcome §c${pl.name}§f to §eBANK §fMenu What do you want to do?`);
	form.button(`Back`);
	form.button(`§8Withdraw Money`);
	form.button(`§8Deposit Money`);
	form.show(pl).then((res) => {
		if(res.selection === 0){
			return menu(pl)
		}
		if(res.selection === 1){
			withdraw(pl) /** withdraw */
		}
		if(res.selection === 2){
			deposit(pl) /** deposit */
		}
	})
}

/** ------------------- */

function withdraw(pl)	{
	pl.runCommand(`scoreboard players add @s ${bank_scoreboard} 0`)
	pl.runCommand(`scoreboard players add @s ${money_scoreboard} 0`)
	let money = getScore('money',pl,true)
	let bank = getScore('bank',pl,true)
	if (bank === 0){
		pl.runCommand(`playsound random.break @s ~~~ 50`);
		pl.tell(`§7> §fSorry You didn't have §cmoney§f in Bank §7<`)
	}else{
		pl.runCommand(`playsound random.pop @s ~~~ 50`);
		let form = new ModalFormData();
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
		form.slider(`§fHi §c${pl.name}§f Slider You §aMoney§f in bank back to you §6Pocket §fScrolling `,0,bank,movestep)
		form.show(pl).then((res) => {
			pl.runCommand(`scoreboard players add @s ${money_scoreboard} ${res.formValues[0]}`)
			pl.runCommand(`scoreboard players remove @s ${bank_scoreboard} ${res.formValues[0]}`)
			pl.tell(`§7> §fYou has been §aWithdraw §fYou Money for §c${res.formValues[0]} §7<`)
		})
	}
}

/** ------------------- */

function deposit(pl)	{
	pl.runCommand(`scoreboard players add @s ${bank_scoreboard} 0`)
	pl.runCommand(`scoreboard players add @s ${money_scoreboard} 0`)
	let money = getScore('money',pl,true)
	let bank = getScore('bank',pl,true)
	if (money === 0){
		pl.runCommand(`playsound random.break @s ~~~ 50`);
		pl.tell(`§7> §fSorry You didn't have any §cmoney§f §7<`)
	}else{
		pl.runCommand(`playsound random.pop @s ~~~ 50`);
		let form = new ModalFormData();
		form.title(`§e»§c ${pl.name}'s §fInterface §e«`)
		form.slider(`§fHi ${pl.name} Slider You §aMoney§f in you §6Pocket to the §eBank! §fScrolling `,0,money,movestep)
		form.show(pl).then((res) => {
			pl.runCommand(`scoreboard players add @s ${bank_scoreboard} ${res.formValues[0]}`)
			pl.runCommand(`scoreboard players remove @s ${money_scoreboard} ${res.formValues[0]}`)
			pl.tell(`§7> §fYou has been §cDeposit §fYou Money for §c${res.formValues[0]} §7<`)
		})
	}
}

/** ------------------- */

function lang(pl)	{
	pl.tell(`§7> §fPlease OPEN §cMENU §fAgin.. §7<`)
	pl.runCommand(`tag @s remove eng`)
}