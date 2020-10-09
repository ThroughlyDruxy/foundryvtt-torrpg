// Import Modules
import { ActorTORRPG } from "./actor.js";
import { TORItemSheet } from "./item-sheet.js";
import { ActorSheetTORRPG } from "./pc-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`Initializing The One Ring System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity
  CONFIG.Actor.entityClass = ActorTORRPG;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("torrpg", ActorSheetTORRPG, {makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("torrpg", TORItemSheet, { makeDefault: true });

  // Register system settings
  game.settings.register("torrpg", "macroShorthand", {
    name: "SETTINGS.SimpleMacroShorthandN",
    hint: "SETTINGS.SimpleMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("torrpg", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("torrpg", "initFormula");
  _simpleUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula, notify = false) {
    // If the formula is valid, use it.
    try {
      new Roll(formula).roll();
      CONFIG.Combat.initiative.formula = formula;
      if (notify) {
        ui.notifications.notify(game.i18n.localize("SIMPLE.NotifyInitFormulaUpdated") + ` ${formula}`);
      }
    }
    // Otherwise, fall back to a d20.
    catch (error) {
      CONFIG.Combat.initiative.formula = "1d20";
      if (notify) {
        ui.notifications.error(game.i18n.localize("SIMPLE.NotifyInitFormulaInvalid") + ` ${formula}`);
      }
    }
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true});
  });

});
