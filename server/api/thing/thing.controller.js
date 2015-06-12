/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var _STEP_COUNT = 10;

var getParams = function(req) {
  //console.log('req.body:'+JSON.stringify(req.body));
  //console.log('req.params:'+JSON.stringify(req.params));
  //console.log('req.query:'+JSON.stringify(req.query));
  return {
    user_id: req.user._id,
    step: req.params.step ? req.params.step : _STEP_COUNT,
    element_id: req.params.id,
    type: req.params.type || req.query.type,
    prevClosed: (req.user.settings && req.user.settings.length) ? req.user.settings[0].prevClosed : false,
    prev: (req.params.prev && req.params.prev.toString()=='true') ? true : false
  };
};

/**
 * Restituisce i pagamenti:
 * parametri:
 *   user_id:    identificativo dell'utente che effettua la richiesta
 *   type:       identifica il tipo di elementi richiesti
 *   step:       numero di elementi richiesti ad ogni step (sia nel passato che nel futuro)
 *   prevClosed: se vero considera anche quelli saldati (altrimenti li nasconde)
 *   prev:       identifica la direzione in cui è richiesto lo step di elementi
 *   element_id: elemento di riferimento per determinare i successivi nella direzione indicata da 'prev'
 *
 * @param params
 * @param next
 */
var getDueThings = function(params, next) {
  var now = new Date().getTime();
  //console.log('getThings - params.prev='+params.prev);
  var where = params.prev ? "this.due_date.getTime() < "+now : "this.due_date.getTime() >= "+now;
  where += ' && !this.type';  //<-- identifica i pagamenti
  //if (params.prev && !params.prevClosed) where += ' && !this.paid';
  //console.log('WHERE filter='+where);
  var filter = {owner:params.user_id, $where: where};
  var sort_type = params.prev ? 'desc' : 'asc';

  //console.log('filter:'+JSON.stringify(filter)+'  sort:'+sort_type);
  Thing.find(filter).sort({due_date: sort_type}).exec(function (err, things) {
    //console.log('fatto:'+err);
    if(err) {
      console.log('[getDueThings] - ERRORE1: '+JSON.stringify(err));
      next(err);
    }
    else {
      //console.log('trovati: '+things.length+' elementi');
      var result = undefined;
      if (params.element_id){
        var index = getIndexOf(things, params.element_id);
        //console.log('indice elemento: '+index);
        if (index>=0 && things.length>index+1)
          result = things.slice(index+1, index+1+_STEP_COUNT);
      }
      else{
        //console.log('effettua lo slice');
        result = things.slice(0, _STEP_COUNT);
        //console.log('in fine: '+result.length+' elementi');
      }
      next(undefined, result);
    }
  });
};

var getTypeThings = function(params, next) {
  var filter = {owner:params.user_id, type:params.type};
  Thing.find(filter).sort({name: 'asc'}).exec(function (err, things) {
    if(err) next(err);
    else next(undefined, things);
  });
};

var getThings = function(params, next) {
  //console.log('tipologia richiesta: '+params.type);
  if (params.type) { return getTypeThings(params, next); }
  else { return getDueThings(params, next); }
};

var getIndexOf = function(array, id) {
  for(var i=0, max=array.length; i < max; i++) {
    if(array[i]._id == id)
      return i;
  }
};

var checkIsPaid = function(thing) {
  var tot = 0;
  if (thing.state && thing.state.length) {
    thing.state.forEach(function (s) {
        tot += parseFloat(s.value);
    });
  }
  thing.paid = (tot>=thing.value);
};



// Get list of things
exports.index = function(req, res) {
  var things = [];
  var params = getParams(req);
  //console.log('params:'+JSON.stringify(params));
  getThings(params, function(err, things_next) {
    if (err) return handleError(res, err);
    things.push.apply(things, things_next);
    //console.log('things next:'+things);
    if (!params.type) {
      params.prev = true;
      getThings(params, function (err, things_prev) {
        if (err) return handleError(res, err);
        things.push.apply(things, things_prev);
        //console.log('things next e prev:'+things);
        //console.log('trovati '+things.length+' elementi');
        return res.json(200, things);
      });
    }
    else {
      //console.log('trovati '+things.length+' elementi');
      return res.json(200, things);
    }
  });
};

exports.step = function(req, res) {
  var params = getParams(req);
  getThings(params, function(err, things) {
    if (err) return handleError(res, err);
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  var uid = req.user._id;
  console.log('[create] - ID utente:'+uid+'   type:'+req.body.type);
  req.body.owner = uid;
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if(req.body.__v) { delete req.body.__v; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { console.log('1. err='+JSON.stringify(err)); return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body, function(a,b) {
      return _.isArray(a) ? b : undefined;
    });
    checkIsPaid(updated);
    //if (updated.__v) updated.__v--;
    //console.log('updated='+JSON.stringify(updated));
    updated.save(function (err) {
      if (err) { console.log('2. err='+JSON.stringify(err)); return handleError(res, err); }
      return res.json(202, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.expired = function(req, res) {
  var params = getParams(req);
  var now = new Date().getTime();
  var where = 'this.due_date.getTime() <= '+now+' && !this.type && !this.paid';
  var filter = {owner:params.user_id, $where: where};

  //console.log('expired request: '+JSON.stringify(filter));

  Thing.find(filter).exec(function(err, things) {
    if (err) return handleError(res, err);
    console.log('trovati expired: '+things.length);
    return res.json(200, things);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
