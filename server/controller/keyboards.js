const { User, Keyboard, Review, sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  getAllKeyboards: async (req, res) => {
    // 1. 업로드되어있는 모든 키보드를 조회해서 클라이언트로 보내준다. ( findAll )
    try {
      const keyboardInfo = await Keyboard.findAll({
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'reviewCount'],
          ],
        },
        include: [{ attributes: [], model: Review }],
        group: ['Keyboard.id'],
      });
      return res.status(200).json({ data: keyboardInfo });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  },
  getFilteredKeyboards: async (req, res) => {
    try {
      const { color, backlight, tenkey, bluetooth, price } = req.body;
      const keys = { 저소음적축: 1, 갈축: 2, 흑축: 3, 적축: 3, 청축: 4 };
      let getSwitch = {};
      for (let key in keys) {
        // 반복문을 돌려 req.body.switch를 getKeys에 넣는다.
        if (keys[key] === req.body.sound) {
          getSwitch[key] = true;
        }
      }

      const filteredKeyboardsInfo = await Keyboard.findAll({
        where: {
          switch: {
            [Op.or]: getSwitch,
          },
          color: color !== 2 ? color : { [Op.or]: [0, 1] },
          backlight: backlight !== 2 ? backlight : { [Op.or]: [0, 1] },
          tenkey: tenkey !== 2 ? tenkey : { [Op.or]: [0, 1] },
          bluetooth: bluetooth !== 2 ? bluetooth : { [Op.or]: [0, 1] },
          price: {
            [Op.lte]: price,
          },
        },
        raw: true,
      });
      return res.status(200).json({ data: filteredKeyboardsInfo });
    } catch (error) {
      return res.sendStatus(500);
    }
  },
  getKeyboardsById: async (req, res) => {
    try {
      // 1. params 로 keyboardId를 받아온다.
      const keyboardId = req.params.id;
      // 2. 바아온 아이디로 특정 키보드를 조회한 후 클라이언트로 보내준다.
      const getKeyboardReview = await Keyboard.findOne({
        where: {
          id: keyboardId,
        },
        include: {
          model: Review,
          include: {
            model: User,
            attributes: ['nickname', 'image'],
          },
        },
      });
      return res.status(200).json({ data: getKeyboardReview });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  },
};
