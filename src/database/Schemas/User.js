const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  idU: { type: String },
  idS: { type: String },
  coins: { type: Number, default: 0 },
  daily: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  Exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 100 },
    id: { type: String, default: "null" },
    user: { type: String, default: "null" },
  },
  work: {
    exp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 250 },
    cooldown: { type: Number, default: 0 },
    coins: { type: Number, default: 200 },
    name: { type: String, default: "null" },
  },
  vip: {
    hasVip: { type: Boolean, default: false },
    date: { type: Number, default: 0 },
  },
  factory: {
    name: { type: String, default: "null" },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 500 },
    owner: { type: String, default: "null" },
    employers: { type: Array, default: [] },
    hasFactory: { type: Boolean, default: false },
    createFactory: { type: Boolean, default: false },
    lastWork: { type: Number, default: 0 },
  },
  about: { type: String, default: "null" },
  reps: {
    size: { type: Number, default: 0 },
    lastRep: { type: String, default: "null" },
    lastSend: { type: String, default: "null" },
    time: { type: Number, default: 0 },
  },
  reminder: {
    list: { type: Array, default: [] },
    has: { type: Number, default: 0 },
  },
  ticket: {
    have: { type: Boolean, default: false },
    channel: { type: String, default: "null" },
    created: { type: String, default: "null" },
  },
  marry: {
    time: { type: Number, default: 0 },
    user: { type: String, default: "null" },
    has: { type: Boolean, default: false },
  },
  steal: {
    time: { type: Number, default: 0 },
    protection: { type: Number, default: 0 },
  },
  infoCall: {
    lastCall: { type: Number, default: 0 },
    totalCall: { type: Number, default: 0 },
    lastRegister: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;