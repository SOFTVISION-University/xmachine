/*! Built with http://stenciljs.com */
const { h } = window.App;

var STATE_DELIMITER = '.';
var EMPTY_ACTIVITY_MAP = {};

var State = /** @class */ (function () {
    function State(value, history, actions, activities, data, 
    /**
     * Internal event queue
     */
    events) {
        if (actions === void 0) { actions = []; }
        if (activities === void 0) { activities = EMPTY_ACTIVITY_MAP; }
        if (data === void 0) { data = {}; }
        if (events === void 0) { events = []; }
        this.value = value;
        this.history = history;
        this.actions = actions;
        this.activities = activities;
        this.data = data;
        this.events = events;
    }
    State.from = function (stateValue) {
        if (stateValue instanceof State) {
            return stateValue;
        }
        return new State(stateValue);
    };
    State.inert = function (stateValue) {
        if (stateValue instanceof State) {
            if (!stateValue.actions.length) {
                return stateValue;
            }
            return new State(stateValue.value, stateValue.history, []);
        }
        return State.from(stateValue);
    };
    State.prototype.toString = function () {
        if (typeof this.value === 'string') {
            return this.value;
        }
        var path = [];
        var marker = this.value;
        while (true) {
            if (typeof marker === 'string') {
                path.push(marker);
                break;
            }
            var _a = Object.keys(marker), firstKey = _a[0], otherKeys = _a.slice(1);
            if (otherKeys.length) {
                return undefined;
            }
            path.push(firstKey);
            marker = marker[firstKey];
        }
        return path.join(STATE_DELIMITER);
    };
    return State;
}());

function getEventType(event) {
    try {
        return typeof event === 'string' || typeof event === 'number'
            ? "" + event
            : event.type;
    }
    catch (e) {
        throw new Error('Events must be strings or objects with a string event.type property.');
    }
}
function toStatePath(stateId, delimiter) {
    try {
        if (Array.isArray(stateId)) {
            return stateId;
        }
        return stateId.toString().split(delimiter);
    }
    catch (e) {
        throw new Error("'" + stateId + "' is not a valid state path.");
    }
}
function toStateValue(stateValue, delimiter) {
    if (stateValue instanceof State) {
        return stateValue.value;
    }
    if (typeof stateValue === 'object' && !(stateValue instanceof State)) {
        return stateValue;
    }
    var statePath = toStatePath(stateValue, delimiter);
    return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
    if (statePath.length === 1) {
        return statePath[0];
    }
    var value = {};
    var marker = value;
    for (var i = 0; i < statePath.length - 1; i++) {
        if (i === statePath.length - 2) {
            marker[statePath[i]] = statePath[i + 1];
        }
        else {
            marker[statePath[i]] = {};
            marker = marker[statePath[i]];
        }
    }
    return value;
}
function mapValues(collection, iteratee) {
    var result = {};
    Object.keys(collection).forEach(function (key) {
        result[key] = iteratee(collection[key], key, collection);
    });
    return result;
}
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */
var path = function (props) { return function (object) {
    var result = object;
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        result = result[prop];
    }
    return result;
}; };
var toStatePaths = function (stateValue) {
    if (typeof stateValue === 'string') {
        return [[stateValue]];
    }
    var result = Object.keys(stateValue)
        .map(function (key) {
        return toStatePaths(stateValue[key]).map(function (subPath) {
            return [key].concat(subPath);
        });
    })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return result;
};
var pathsToStateValue = function (paths) {
    var result = {};
    if (paths && paths.length === 1 && paths[0].length === 1) {
        return paths[0][0];
    }
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var currentPath = paths_1[_i];
        var marker = result;
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < currentPath.length; i++) {
            var subPath = currentPath[i];
            if (i === currentPath.length - 2) {
                marker[subPath] = currentPath[i + 1];
                break;
            }
            marker[subPath] = marker[subPath] || {};
            marker = marker[subPath];
        }
    }
    return result;
};

function matchesState(parentStateId, childStateId, delimiter) {
    if (delimiter === void 0) { delimiter = STATE_DELIMITER; }
    var parentStateValue = toStateValue(parentStateId, delimiter);
    var childStateValue = toStateValue(childStateId, delimiter);
    if (typeof childStateValue === 'string') {
        if (typeof parentStateValue === 'string') {
            return childStateValue === parentStateValue;
        }
        // Parent more specific than child
        return false;
    }
    if (typeof parentStateValue === 'string') {
        return parentStateValue in childStateValue;
    }
    return Object.keys(parentStateValue).every(function (key) {
        if (!(key in childStateValue)) {
            return false;
        }
        return matchesState(parentStateValue[key], childStateValue[key]);
    });
}

var PREFIX = 'xstate';
// xstate-specific action types
var actionTypes = {
    start: PREFIX + ".start",
    stop: PREFIX + ".stop",
    raise: PREFIX + ".raise",
    send: PREFIX + ".send",
    cancel: PREFIX + ".cancel",
    null: PREFIX + ".null"
};
var createActivityAction = function (actionType) { return function (activity) {
    var data = typeof activity === 'string' || typeof activity === 'number'
        ? { type: activity }
        : activity;
    return {
        type: actionType,
        activity: getEventType(activity),
        data: data
    };
}; };
var toEventObject = function (event) {
    if (typeof event === 'string' || typeof event === 'number') {
        return { type: event };
    }
    return event;
};
var start = createActivityAction(actionTypes.start);
var stop = createActivityAction(actionTypes.stop);

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var STATE_DELIMITER$1 = '.';
var HISTORY_KEY = '$history';
var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var isStateId = function (str) { return str[0] === STATE_IDENTIFIER; };
var emptyActions = Object.freeze({
    onEntry: [],
    onExit: [],
    actions: []
});
/**
 * Given a StateNode, walk up the parent chain until we find an
 * orthogonal region of a parallel state, or the top level machine
 * itself
 */
var regionOf = function (node) {
    // If we reach the top of the state machine, we're a "region".
    // If our parent is a parallel state, we're a region.
    while (node.parent && !node.parent.parallel) {
        node = node.parent;
    }
    return node;
};
/**
 * Ensure that the passed in StateNode instance belongs to a region
 * that previously had not been used, or that matches the existing
 * StateNode for the orthogonal regions.  This function is used to
 * verify that a transition that has multiple targets ends doesn't try
 * to target several states in the same orthogonal region.  The passed
 * state is added to the regions data structure using the state's
 * _region_ (see regionOf), and the region's parent.  If there is
 * already an object in the structure which is not already the state
 * in question, an Error is thrown, otherwise the state is added to
 * the structure, and the _region_ is returned.
 *
 * @param sourceState the state in which the event was triggered (used
 * to report error messages)
 * @param event the event that triggered the transition (used to
 * report error messages)
 * @param regions A data structure that retains the current set of
 * orthogonal regions (their IDs), grouped by their parallel state
 * (their IDs), with the values being the chosen states
 * @param state A state to add to the structure if possible.
 * @returns The region of the state, in order for the caller to repeat the process for the parent.
 * @throws Error if the region found already exists in the regions
 */
var ensureTargetStateIsInCorrectRegion = function (sourceState, event, regions, stateToCheck) {
    var region = regionOf(stateToCheck);
    var parent = region.parent;
    var parentId = parent ? parent.id : ''; // '' == machine
    regions[parentId] = regions[parentId] || {};
    if (regions[parentId][region.id] &&
        regions[parentId][region.id] !== stateToCheck) {
        throw new Error("Event '" + event + "' on state '" + sourceState.id + "' leads to an invalid configuration: " +
            ("Two or more states in the orthogonal region '" + region.id + "'."));
    }
    // Keep track of which state was chosen in a particular region.
    regions[parentId][region.id] = stateToCheck;
    return region;
};
var StateNode = /** @class */ (function () {
    function StateNode(config) {
        var _this = this;
        this.config = config;
        this.__cache = {
            events: undefined,
            relativeValue: new Map(),
            initialState: undefined
        };
        this.idMap = {};
        this.key = config.key || '(machine)';
        this.parent = config.parent;
        this.machine = this.parent ? this.parent.machine : this;
        this.path = this.parent ? this.parent.path.concat(this.key) : [];
        this.delimiter =
            config.delimiter ||
                (this.parent ? this.parent.delimiter : STATE_DELIMITER$1);
        this.id =
            config.id ||
                (this.machine
                    ? [this.machine.key].concat(this.path).join(this.delimiter)
                    : this.key);
        this.initial = config.initial;
        this.parallel = !!config.parallel;
        this.states = (config.states
            ? mapValues(config.states, function (stateConfig, key) {
                var stateNode = new StateNode(__assign({}, stateConfig, { key: key, parent: _this }));
                Object.assign(_this.idMap, __assign((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
                return stateNode;
                var _a;
            })
            : {});
        this.on = config.on ? this.formatTransitions(config.on) : {};
        this.strict = !!config.strict;
        this.onEntry = config.onEntry
            ? [].concat(config.onEntry)
            : undefined;
        this.onExit = config.onExit
            ? [].concat(config.onExit)
            : undefined;
        this.data = config.data;
        this.activities = config.activities;
    }
    StateNode.prototype.getStateNodes = function (state) {
        var _this = this;
        var stateValue = state instanceof State
            ? state.value
            : toStateValue(state, this.delimiter);
        if (typeof stateValue === 'string') {
            var initialStateValue = this.getStateNode(stateValue).initial;
            return initialStateValue
                ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a))
                : [this.states[stateValue]];
        }
        var subStateKeys = Object.keys(stateValue);
        var subStateNodes = subStateKeys.map(function (subStateKey) {
            return _this.getStateNode(subStateKey);
        });
        return subStateNodes.concat(subStateKeys.reduce(function (allSubStateNodes, subStateKey) {
            var subStateNode = _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
            return allSubStateNodes.concat(subStateNode);
        }, []));
        var _a;
    };
    StateNode.prototype.handles = function (event) {
        var eventType = getEventType(event);
        return this.events.indexOf(eventType) !== -1;
    };
    StateNode.prototype.transition = function (state, event, extendedState) {
        var resolvedStateValue = typeof state === 'string'
            ? this.resolve(pathToStateValue(this.getResolvedPath(state)))
            : state instanceof State ? state : this.resolve(state);
        if (this.strict) {
            var eventType = getEventType(event);
            if (this.events.indexOf(eventType) === -1) {
                throw new Error("Machine '" + this.id + "' does not accept event '" + eventType + "'");
            }
        }
        var currentState = State.from(resolvedStateValue);
        var stateTransition = this.transitionStateValue(currentState, event, currentState, extendedState);
        var nextState = this.stateTransitionToState(stateTransition, currentState);
        if (!nextState) {
            return State.inert(currentState);
        }
        var maybeNextState = nextState;
        var raisedEvents = nextState.actions.filter(function (action) { return typeof action === 'object' && action.type === actionTypes.raise; });
        if (raisedEvents.length) {
            var raisedEvent = raisedEvents[0].event;
            nextState = this.transition(nextState, raisedEvent, extendedState);
            (_a = nextState.actions).unshift.apply(_a, nextState.actions);
            return nextState;
        }
        if (stateTransition.events.length) {
            var raised = stateTransition.events[0].type === actionTypes.raise
                ? stateTransition.events[0].event
                : undefined;
            var nullEvent = stateTransition.events[0].type === actionTypes.null;
            if (raised || nullEvent) {
                maybeNextState = this.transition(nextState, nullEvent ? NULL_EVENT : raised, extendedState);
                (_b = maybeNextState.actions).unshift.apply(_b, nextState.actions);
                return maybeNextState;
            }
        }
        return nextState;
        var _a, _b;
    };
    StateNode.prototype.stateTransitionToState = function (stateTransition, prevState) {
        var nextStatePaths = stateTransition.statePaths, nextActions = stateTransition.actions, nextActivities = stateTransition.activities, events = stateTransition.events;
        if (!nextStatePaths.length) {
            return undefined;
        }
        var prevActivities = prevState instanceof State ? prevState.activities : undefined;
        var activities = __assign({}, prevActivities, nextActivities);
        var nextStateValue = this.resolve(pathsToStateValue(nextStatePaths));
        return new State(
        // next state value
        nextStateValue, 
        // history
        State.from(prevState), 
        // effects
        nextActions
            ? nextActions.onExit
                .concat(nextActions.actions)
                .concat(nextActions.onEntry)
            : [], 
        // activities
        activities, 
        // data
        this.getStateNodes(nextStateValue).reduce(function (data, stateNode) {
            if (stateNode.data !== undefined) {
                data[stateNode.id] = stateNode.data;
            }
            return data;
        }, {}), events);
    };
    StateNode.prototype.getStateNode = function (stateKey) {
        if (isStateId(stateKey)) {
            return this.machine.getStateNodeById(stateKey);
        }
        if (!this.states) {
            throw new Error("Unable to retrieve child state '" + stateKey + "' from '" + this
                .id + "'; no child states exist.");
        }
        var result = this.states[stateKey];
        if (!result) {
            throw new Error("Child state '" + stateKey + "' does not exist on '" + this.id + "'");
        }
        return result;
    };
    StateNode.prototype.getStateNodeById = function (stateId) {
        var resolvedStateId = isStateId(stateId)
            ? stateId.slice(STATE_IDENTIFIER.length)
            : stateId;
        var stateNode = this.idMap[resolvedStateId];
        if (!stateNode) {
            throw new Error("Substate '#" + resolvedStateId + "' does not exist on '" + this.id + "'");
        }
        return stateNode;
    };
    StateNode.prototype.resolve = function (stateValue) {
        var _this = this;
        if (typeof stateValue === 'string') {
            var subStateNode = this.getStateNode(stateValue);
            return subStateNode.initial
                ? (_a = {}, _a[stateValue] = subStateNode.initialStateValue, _a) : stateValue;
        }
        if (this.parallel) {
            return mapValues(this.initialStateValue, function (subStateValue, subStateKey) {
                return _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue);
            });
        }
        return mapValues(stateValue, function (subStateValue, subStateKey) {
            return _this.getStateNode(subStateKey).resolve(subStateValue);
        });
        var _a;
    };
    StateNode.prototype.transitionStateValue = function (state, event, fullState, extendedState) {
        var _this = this;
        var history = state.history;
        var stateValue = state.value;
        if (typeof stateValue === 'string') {
            var subStateNode = this.getStateNode(stateValue);
            var result = subStateNode.next(event, fullState, history ? history.value : undefined, extendedState);
            // If a machine substate returns no potential transitions,
            // check on the machine itself.
            if (!result.statePaths.length && !this.parent) {
                return this.next(event, fullState, history ? history.value : undefined, extendedState);
            }
            return result;
        }
        // Potential transition tuples from parent state nodes
        var potentialStateTransitions = [];
        var willTransition = false;
        var nextStateTransitionMap = mapValues(stateValue, function (subStateValue, subStateKey) {
            var subStateNode = _this.getStateNode(subStateKey);
            var subHistory = history ? history.value[subStateKey] : undefined;
            var subState = new State(subStateValue, subHistory ? State.from(subHistory) : undefined);
            var subStateTransition = subStateNode.transitionStateValue(subState, event, fullState, extendedState);
            if (!subStateTransition.statePaths.length) {
                potentialStateTransitions.push(subStateNode.next(event, fullState, history ? history.value : undefined, extendedState));
            }
            else {
                willTransition = true;
            }
            return subStateTransition;
        });
        if (!willTransition) {
            if (this.parallel) {
                if (potentialStateTransitions.length) {
                    // Select the first potential state transition to take
                    return potentialStateTransitions[0];
                }
                return {
                    statePaths: [],
                    actions: emptyActions,
                    activities: undefined,
                    events: []
                };
            }
            var subStateKey = Object.keys(nextStateTransitionMap)[0];
            // try with parent
            var _a = this.getStateNode(subStateKey).next(event, fullState, history ? history.value : undefined, extendedState), parentStatePaths = _a.statePaths, parentNextActions = _a.actions, parentActivities = _a.activities;
            var nextActions = nextStateTransitionMap[subStateKey].actions;
            var activities = nextStateTransitionMap[subStateKey].activities;
            var allActivities = __assign({}, activities, parentActivities);
            var allActions = parentNextActions
                ? nextActions
                    ? {
                        onEntry: nextActions.onEntry.concat(parentNextActions.onEntry),
                        actions: nextActions.actions.concat(parentNextActions.actions),
                        onExit: nextActions.onExit.concat(parentNextActions.onExit)
                    }
                    : parentNextActions
                : nextActions;
            return {
                statePaths: parentStatePaths,
                actions: allActions,
                activities: allActivities,
                events: []
            };
        }
        if (this.parallel) {
            nextStateTransitionMap = __assign({}, mapValues(this.initialState.value, function (subStateValue, key) {
                var subStateTransition = nextStateTransitionMap[key];
                return {
                    statePaths: subStateTransition && subStateTransition.statePaths.length
                        ? subStateTransition.statePaths
                        : toStatePaths(stateValue[key] || subStateValue).map(function (subPath) { return _this.getStateNode(key).path.concat(subPath); }),
                    actions: subStateTransition && subStateTransition.actions
                        ? subStateTransition.actions
                        : {
                            onEntry: [],
                            onExit: [],
                            actions: []
                        },
                    activities: undefined,
                    events: []
                };
            }));
        }
        var finalActions = {
            onEntry: [],
            actions: [],
            onExit: []
        };
        var finalActivities = {};
        mapValues(nextStateTransitionMap, function (subStateTransition) {
            var 
            // statePaths: nextSubStatePaths,
            nextSubActions = subStateTransition.actions, nextSubActivities = subStateTransition.activities;
            if (nextSubActions) {
                if (nextSubActions.onEntry) {
                    (_a = finalActions.onEntry).push.apply(_a, nextSubActions.onEntry);
                }
                if (nextSubActions.actions) {
                    (_b = finalActions.actions).push.apply(_b, nextSubActions.actions);
                }
                if (nextSubActions.onExit) {
                    (_c = finalActions.onExit).push.apply(_c, nextSubActions.onExit);
                }
            }
            if (nextSubActivities) {
                Object.assign(finalActivities, nextSubActivities);
            }
            var _a, _b, _c;
        });
        return {
            statePaths: Object.keys(nextStateTransitionMap)
                .map(function (stateKey) { return nextStateTransitionMap[stateKey].statePaths; })
                .reduce(function (a, b) { return a.concat(b); }, []),
            actions: finalActions,
            activities: finalActivities,
            events: []
        };
    };
    StateNode.prototype.next = function (event, fullState, history, extendedState) {
        var _this = this;
        var eventType = getEventType(event);
        var actionMap = { onEntry: [], onExit: [], actions: [] };
        var activityMap = {};
        var candidates = this.on[eventType];
        if (this.onExit) {
            actionMap.onExit = this.onExit;
        }
        if (this.activities) {
            this.activities.forEach(function (activity) {
                activityMap[getEventType(activity)] = false;
                actionMap.onExit = actionMap.onExit.concat(stop(activity));
            });
        }
        if (!candidates) {
            return {
                statePaths: [],
                actions: actionMap,
                activities: activityMap,
                events: []
            };
        }
        var nextStateStrings = [];
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var candidate = candidates_1[_i];
            var _a = candidate, cond = _a.cond, stateIn = _a.in, transitionActions = _a.actions;
            var extendedStateObject = extendedState || {};
            var eventObject = toEventObject(event);
            var isInState = stateIn
                ? matchesState(toStateValue(stateIn, this.delimiter), path(this.path.slice(0, -2))(fullState.value))
                : true;
            if ((!cond || cond(extendedStateObject, eventObject)) &&
                (!stateIn || isInState)) {
                nextStateStrings = Array.isArray(candidate.target)
                    ? candidate.target
                    : [candidate.target];
                if (transitionActions) {
                    actionMap.actions = actionMap.actions.concat(transitionActions);
                }
                break;
            }
        }
        if (nextStateStrings.length === 0) {
            return {
                statePaths: [],
                actions: actionMap,
                activities: activityMap,
                events: []
            };
        }
        var finalPaths = [];
        var raisedEvents = [];
        var usedRegions = {};
        nextStateStrings.forEach(function (nextStateString) {
            var nextStatePath = _this.getResolvedPath(nextStateString);
            var currentState = isStateId(nextStateString)
                ? _this.machine
                : _this.parent;
            var currentHistory = history;
            var currentPath = _this.key;
            nextStatePath.forEach(function (subPath) {
                if (subPath === '') {
                    actionMap.onExit = [];
                    currentState = _this;
                    return;
                }
                if (!currentState || !currentState.states) {
                    throw new Error("Unable to read '" + subPath + "' from '" + _this.id + "'");
                }
                if (subPath === HISTORY_KEY) {
                    if (!Object.keys(currentState.states).length) {
                        subPath = '';
                    }
                    else if (currentHistory) {
                        subPath =
                            typeof currentHistory === 'object'
                                ? Object.keys(currentHistory)[0]
                                : currentHistory;
                    }
                    else if (currentState.initial) {
                        subPath = currentState.initial;
                    }
                    else {
                        throw new Error("Cannot read '" + HISTORY_KEY + "' from state '" + currentState.id + "': missing 'initial'");
                    }
                }
                try {
                    if (subPath !== '') {
                        currentState = currentState.getStateNode(subPath);
                    }
                }
                catch (e) {
                    throw new Error("Event '" + event + "' on state '" + currentPath + "' leads to undefined state '" + nextStatePath.join(_this.delimiter) + "'.");
                }
                if (currentState.onEntry) {
                    actionMap.onEntry = actionMap.onEntry.concat(currentState.onEntry);
                }
                if (currentState.activities) {
                    currentState.activities.forEach(function (activity) {
                        activityMap[getEventType(activity)] = true;
                        actionMap.onEntry = actionMap.onEntry.concat(start(activity));
                    });
                }
                currentPath = subPath;
                if (currentHistory) {
                    currentHistory = currentHistory[subPath];
                }
            });
            if (!currentState) {
                throw new Error('no state');
            }
            var region = ensureTargetStateIsInCorrectRegion(_this, event, usedRegions, currentState);
            while (region.parent) {
                region = ensureTargetStateIsInCorrectRegion(_this, event, usedRegions, region.parent);
            }
            var paths = [currentState.path];
            if (currentState.initial || currentState.parallel) {
                var initialState = currentState.initialState;
                actionMap.onEntry = actionMap.onEntry.concat(initialState.actions);
                paths = toStatePaths(initialState.value).map(function (subPath) {
                    return currentState.path.concat(subPath);
                });
            }
            finalPaths.push.apply(finalPaths, paths);
            while (currentState.initial) {
                if (!currentState || !currentState.states) {
                    throw new Error("Invalid initial state");
                }
                currentState = currentState.states[currentState.initial];
                if (currentState.activities) {
                    currentState.activities.forEach(function (activity) {
                        activityMap[getEventType(activity)] = true;
                        actionMap.onEntry = actionMap.onEntry.concat(start(activity));
                    });
                }
            }
            var myActions = (currentState.onEntry
                ? currentState.onEntry.filter(function (action) {
                    return typeof action === 'object' && action.type === actionTypes.raise;
                })
                : []).concat(currentState.on[NULL_EVENT] ? { type: actionTypes.null } : []);
            myActions.forEach(function (action) { return raisedEvents.push(action); });
        });
        return {
            statePaths: finalPaths,
            actions: actionMap,
            activities: activityMap,
            events: raisedEvents
        };
    };
    Object.defineProperty(StateNode.prototype, "resolvedStateValue", {
        get: function () {
            var key = this.key;
            if (this.parallel) {
                return _a = {},
                    _a[key] = mapValues(this.states, function (stateNode) { return stateNode.resolvedStateValue[stateNode.key]; }),
                    _a;
            }
            if (!this.initial) {
                // If leaf node, value is just the state node's key
                return key;
            }
            return _b = {},
                _b[key] = this.states[this.initial].resolvedStateValue,
                _b;
            var _a, _b;
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getResolvedPath = function (stateIdentifier) {
        if (isStateId(stateIdentifier)) {
            var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];
            if (!stateNode) {
                throw new Error("Unable to find state node '" + stateIdentifier + "'");
            }
            return stateNode.path;
        }
        return toStatePath(stateIdentifier, this.delimiter);
    };
    Object.defineProperty(StateNode.prototype, "initialStateValue", {
        get: function () {
            var initialStateValue = this.__cache.initialState ||
                (this.parallel
                    ? mapValues(this.states, function (state) { return state.initialStateValue; })
                    : typeof this.resolvedStateValue === 'string'
                        ? undefined
                        : this.resolvedStateValue[this.key]);
            this.__cache.initialState = initialStateValue;
            return this.__cache.initialState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateNode.prototype, "initialState", {
        get: function () {
            var initialStateValue = this.initialStateValue;
            if (!initialStateValue) {
                throw new Error("Cannot retrieve initial state from simple state '" + this.id + ".'");
            }
            var activityMap = {};
            var actions = [];
            this.getStateNodes(initialStateValue).forEach(function (stateNode) {
                if (stateNode.onEntry) {
                    actions.push.apply(actions, stateNode.onEntry);
                }
                if (stateNode.activities) {
                    stateNode.activities.forEach(function (activity) {
                        activityMap[getEventType(activity)] = true;
                        actions.push(start(activity));
                    });
                }
            });
            return new State(initialStateValue, undefined, actions, activityMap);
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.getStates = function (stateValue) {
        var _this = this;
        if (typeof stateValue === 'string') {
            return [this.states[stateValue]];
        }
        var stateNodes = [];
        Object.keys(stateValue).forEach(function (key) {
            stateNodes.push.apply(stateNodes, _this.states[key].getStates(stateValue[key]));
        });
        return stateNodes;
    };
    StateNode.prototype.getState = function (relativeStateId) {
        if (typeof relativeStateId === 'string' && isStateId(relativeStateId)) {
            return this.getStateNodeById(relativeStateId);
        }
        var statePath = toStatePath(relativeStateId, this.delimiter);
        try {
            return statePath.reduce(function (subState, subPath) {
                if (!subState.states) {
                    throw new Error("Cannot retrieve subPath '" + subPath + "' from node with no states");
                }
                return subState.states[subPath];
            }, this);
        }
        catch (e) {
            throw new Error("State '" + relativeStateId + " does not exist on machine '" + this.id + "'");
        }
    };
    Object.defineProperty(StateNode.prototype, "events", {
        get: function () {
            if (this.__cache.events) {
                return this.__cache.events;
            }
            var states = this.states;
            var events = new Set(Object.keys(this.on));
            if (states) {
                Object.keys(states).forEach(function (stateId) {
                    var state = states[stateId];
                    if (state.states) {
                        for (var _i = 0, _a = state.events; _i < _a.length; _i++) {
                            var event_1 = _a[_i];
                            events.add("" + event_1);
                        }
                    }
                });
            }
            return (this.__cache.events = Array.from(events));
        },
        enumerable: true,
        configurable: true
    });
    StateNode.prototype.formatTransitions = function (onConfig) {
        return mapValues(onConfig, function (value) {
            if (value === undefined) {
                return [];
            }
            if (Array.isArray(value)) {
                return value;
            }
            if (typeof value === 'string') {
                return [{ target: value }];
            }
            return Object.keys(value).map(function (target) {
                return __assign({ target: target }, value[target]);
            });
        });
    };
    return StateNode;
}());

function Machine$1(config) {
    return new StateNode(config);
}

const lightMachineStateChart = {
    key: 'light',
    initial: 'green',
    states: {
        green: {
            on: {
                timer: 'yellow',
            },
            onEntry: ['colorGreen']
        },
        yellow: {
            on: {
                timer: 'red',
            },
            onEntry: ['colorYellow']
        },
        red: {
            on: {
                timer: 'green',
            },
            onEntry: ['colorRed']
        }
    }
};
const lightMachine = Machine$1(lightMachineStateChart);

const machine = (statechart) => {
    // tslint:disable-next-line:no-reserved-keywords
    function classDecorator(constructor) {
        return class extends constructor {
            constructor(..._args) {
                super();
                this.fsm = statechart instanceof Machine$1 ? statechart : Machine$1(statechart);
                this.currentState = this.fsm.initialState.value;
                this.transition = (event, eventValue) => {
                    const newState = this.fsm.transition(this.currentState, event, eventValue);
                    this.currentState = newState.value;
                    this.runActions(newState, eventValue);
                };
                this.runActions(this.fsm.initialState, {});
            }
            getMachine() {
                return this.fsm;
            }
            runActions(state, eventValue) {
                const { actions: actions$$1 } = state;
                actions$$1.forEach((action) => {
                    const actionFn = this[action];
                    if (actionFn && typeof actionFn === 'function') {
                        actionFn(eventValue);
                    }
                    else {
                        console.error(`${action} does NOT exist on machine ${statechart.key}`);
                    }
                });
            }
        };
    }
    return classDecorator;
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var constants = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATE_DELIMITER = '.';
exports.EMPTY_ACTIVITY_MAP = {};
});

var constants$1 = unwrapExports(constants);
var constants_1 = constants.STATE_DELIMITER;
var constants_2 = constants.EMPTY_ACTIVITY_MAP;

var constants$2 = /*#__PURE__*/Object.freeze({
    default: constants$1,
    __moduleExports: constants,
    STATE_DELIMITER: constants_1,
    EMPTY_ACTIVITY_MAP: constants_2
});

var constants_1$1 = ( constants$2 && constants$1 ) || constants$2;

var State_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var State = /** @class */ (function () {
    function State(value, history, actions, activities, data, 
    /**
     * Internal event queue
     */
    events) {
        if (actions === void 0) { actions = []; }
        if (activities === void 0) { activities = constants_1$1.EMPTY_ACTIVITY_MAP; }
        if (data === void 0) { data = {}; }
        if (events === void 0) { events = []; }
        this.value = value;
        this.history = history;
        this.actions = actions;
        this.activities = activities;
        this.data = data;
        this.events = events;
    }
    State.from = function (stateValue) {
        if (stateValue instanceof State) {
            return stateValue;
        }
        return new State(stateValue);
    };
    State.inert = function (stateValue) {
        if (stateValue instanceof State) {
            if (!stateValue.actions.length) {
                return stateValue;
            }
            return new State(stateValue.value, stateValue.history, []);
        }
        return State.from(stateValue);
    };
    State.prototype.toString = function () {
        if (typeof this.value === 'string') {
            return this.value;
        }
        var path = [];
        var marker = this.value;
        while (true) {
            if (typeof marker === 'string') {
                path.push(marker);
                break;
            }
            var _a = Object.keys(marker), firstKey = _a[0], otherKeys = _a.slice(1);
            if (otherKeys.length) {
                return undefined;
            }
            path.push(firstKey);
            marker = marker[firstKey];
        }
        return path.join(constants_1$1.STATE_DELIMITER);
    };
    return State;
}());
exports.State = State;
});

var State$1 = unwrapExports(State_1);
var State_2 = State_1.State;

var State$2 = /*#__PURE__*/Object.freeze({
    default: State$1,
    __moduleExports: State_1,
    State: State_2
});

var State_1$1 = ( State$2 && State$1 ) || State$2;

var utils = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

function getEventType(event) {
    try {
        return typeof event === 'string' || typeof event === 'number'
            ? "" + event
            : event.type;
    }
    catch (e) {
        throw new Error('Events must be strings or objects with a string event.type property.');
    }
}
exports.getEventType = getEventType;
function getActionType(action) {
    try {
        return typeof action === 'string' || typeof action === 'number'
            ? "" + action
            : typeof action === 'function' ? action.name : action.type;
    }
    catch (e) {
        throw new Error('Events must be strings or objects with a string event.type property.');
    }
}
exports.getActionType = getActionType;
function toStatePath(stateId, delimiter) {
    try {
        if (Array.isArray(stateId)) {
            return stateId;
        }
        return stateId.toString().split(delimiter);
    }
    catch (e) {
        throw new Error("'" + stateId + "' is not a valid state path.");
    }
}
exports.toStatePath = toStatePath;
function toStateValue(stateValue, delimiter) {
    if (stateValue instanceof State_1$1.State) {
        return stateValue.value;
    }
    if (typeof stateValue === 'object' && !(stateValue instanceof State_1$1.State)) {
        return stateValue;
    }
    var statePath = toStatePath(stateValue, delimiter);
    return pathToStateValue(statePath);
}
exports.toStateValue = toStateValue;
function pathToStateValue(statePath) {
    if (statePath.length === 1) {
        return statePath[0];
    }
    var value = {};
    var marker = value;
    for (var i = 0; i < statePath.length - 1; i++) {
        if (i === statePath.length - 2) {
            marker[statePath[i]] = statePath[i + 1];
        }
        else {
            marker[statePath[i]] = {};
            marker = marker[statePath[i]];
        }
    }
    return value;
}
exports.pathToStateValue = pathToStateValue;
function mapValues(collection, iteratee) {
    var result = {};
    Object.keys(collection).forEach(function (key) {
        result[key] = iteratee(collection[key], key, collection);
    });
    return result;
}
exports.mapValues = mapValues;
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */
exports.path = function (props) { return function (object) {
    var result = object;
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        result = result[prop];
    }
    return result;
}; };
exports.toStatePaths = function (stateValue) {
    if (typeof stateValue === 'string') {
        return [[stateValue]];
    }
    var result = Object.keys(stateValue)
        .map(function (key) {
        return exports.toStatePaths(stateValue[key]).map(function (subPath) {
            return [key].concat(subPath);
        });
    })
        .reduce(function (a, b) { return a.concat(b); }, []);
    return result;
};
exports.pathsToStateValue = function (paths) {
    var result = {};
    if (paths && paths.length === 1 && paths[0].length === 1) {
        return paths[0][0];
    }
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var currentPath = paths_1[_i];
        var marker = result;
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < currentPath.length; i++) {
            var subPath = currentPath[i];
            if (i === currentPath.length - 2) {
                marker[subPath] = currentPath[i + 1];
                break;
            }
            marker[subPath] = marker[subPath] || {};
            marker = marker[subPath];
        }
    }
    return result;
};
});

var utils$1 = unwrapExports(utils);
var utils_1 = utils.getEventType;
var utils_2 = utils.getActionType;
var utils_3 = utils.toStatePath;
var utils_4 = utils.toStateValue;
var utils_5 = utils.pathToStateValue;
var utils_6 = utils.mapValues;
var utils_7 = utils.path;
var utils_8 = utils.toStatePaths;
var utils_9 = utils.pathsToStateValue;

var utils$2 = /*#__PURE__*/Object.freeze({
    default: utils$1,
    __moduleExports: utils,
    getEventType: utils_1,
    getActionType: utils_2,
    toStatePath: utils_3,
    toStateValue: utils_4,
    pathToStateValue: utils_5,
    mapValues: utils_6,
    path: utils_7,
    toStatePaths: utils_8,
    pathsToStateValue: utils_9
});

var utils_1$1 = ( utils$2 && utils$1 ) || utils$2;

var graph = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });

var EMPTY_MAP = {};
function getNodes(node) {
    var states = node.states;
    var nodes = Object.keys(states).reduce(function (accNodes, stateKey) {
        var subState = states[stateKey];
        var subNodes = getNodes(states[stateKey]);
        accNodes.push.apply(accNodes, [subState].concat(subNodes));
        return accNodes;
    }, []);
    return nodes;
}
exports.getNodes = getNodes;
function getEventEdges(node, event) {
    var transitions = node.on[event];
    return transitions.map(function (transition) {
        return {
            source: node,
            target: node.parent.getState(transition.target),
            event: event,
            actions: transition.actions ? transition.actions.map(utils_1$1.getActionType) : [],
            cond: transition.cond
        };
    });
}
function getEdges(node) {
    var edges = [];
    if (node.states) {
        Object.keys(node.states).forEach(function (stateKey) {
            edges.push.apply(edges, getEdges(node.states[stateKey]));
        });
    }
    Object.keys(node.on).forEach(function (event) {
        edges.push.apply(edges, getEventEdges(node, event));
    });
    return edges;
}
exports.getEdges = getEdges;
function getAdjacencyMap(node) {
    var adjacency = {};
    var events = node.events;
    function findAdjacencies(stateValue) {
        var stateKey = JSON.stringify(stateValue);
        if (adjacency[stateKey]) {
            return;
        }
        adjacency[stateKey] = {};
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var event_1 = events_1[_i];
            var nextState = node.transition(stateValue, event_1);
            adjacency[stateKey][event_1] = { state: nextState.value };
            findAdjacencies(nextState.value);
        }
    }
    findAdjacencies(node.initialState.value);
    return adjacency;
}
exports.getAdjacencyMap = getAdjacencyMap;
function getShortestPaths(machine) {
    if (!machine.states) {
        return EMPTY_MAP;
    }
    var adjacency = getAdjacencyMap(machine);
    var initialStateId = JSON.stringify(machine.initialState.value);
    var pathMap = (_a = {},
        _a[initialStateId] = [],
        _a);
    var visited = new Set();
    function util(stateValue) {
        var stateId = JSON.stringify(stateValue);
        visited.add(stateId);
        var eventMap = adjacency[stateId];
        for (var _i = 0, _a = Object.keys(eventMap); _i < _a.length; _i++) {
            var event_2 = _a[_i];
            var nextStateValue = eventMap[event_2].state;
            if (!nextStateValue) {
                continue;
            }
            var nextStateId = JSON.stringify(utils_1$1.toStateValue(nextStateValue, machine.delimiter));
            if (!pathMap[nextStateId] ||
                pathMap[nextStateId].length > pathMap[stateId].length + 1) {
                pathMap[nextStateId] = (pathMap[stateId] || []).concat([
                    { state: stateValue, event: event_2 }
                ]);
            }
        }
        for (var _b = 0, _c = Object.keys(eventMap); _b < _c.length; _b++) {
            var event_3 = _c[_b];
            var nextStateValue = eventMap[event_3].state;
            if (!nextStateValue) {
                continue;
            }
            var nextStateId = JSON.stringify(nextStateValue);
            if (visited.has(nextStateId)) {
                continue;
            }
            util(nextStateValue);
        }
        return pathMap;
    }
    util(machine.initialState.value);
    return pathMap;
    var _a;
}
exports.getShortestPaths = getShortestPaths;
function getShortestPathsAsArray(machine) {
    var result = getShortestPaths(machine);
    return Object.keys(result).map(function (key) { return ({
        state: JSON.parse(key),
        path: result[key]
    }); });
}
exports.getShortestPathsAsArray = getShortestPathsAsArray;
function getSimplePaths(machine) {
    if (!machine.states) {
        return EMPTY_MAP;
    }
    var adjacency = getAdjacencyMap(machine);
    var visited = new Set();
    var path = [];
    var paths = {};
    function util(fromPathId, toPathId) {
        visited.add(fromPathId);
        if (fromPathId === toPathId) {
            paths[toPathId] = paths[toPathId] || [];
            paths[toPathId].push(path.slice());
        }
        else {
            for (var _i = 0, _a = Object.keys(adjacency[fromPathId]); _i < _a.length; _i++) {
                var subEvent = _a[_i];
                var nextStateValue = adjacency[fromPathId][subEvent].state;
                if (!nextStateValue) {
                    continue;
                }
                var nextStateId = JSON.stringify(nextStateValue);
                if (!visited.has(nextStateId)) {
                    path.push({ state: JSON.parse(fromPathId), event: subEvent });
                    util(nextStateId, toPathId);
                }
            }
        }
        path.pop();
        visited.delete(fromPathId);
    }
    var initialStateId = JSON.stringify(machine.initialState.value);
    Object.keys(adjacency).forEach(function (nextStateId) {
        util(initialStateId, nextStateId);
    });
    return paths;
}
exports.getSimplePaths = getSimplePaths;
function getSimplePathsAsArray(machine) {
    var result = getSimplePaths(machine);
    return Object.keys(result).map(function (key) { return ({
        state: JSON.parse(key),
        paths: result[key]
    }); });
}
exports.getSimplePathsAsArray = getSimplePathsAsArray;
});

unwrapExports(graph);
var graph_1 = graph.getNodes;
var graph_2 = graph.getEdges;
var graph_3 = graph.getAdjacencyMap;
var graph_4 = graph.getShortestPaths;
var graph_5 = graph.getShortestPathsAsArray;
var graph_6 = graph.getSimplePaths;
var graph_7 = graph.getSimplePathsAsArray;

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const lightStyle = {
    'background-color': 'blue',
    'text-align': 'center',
    'border-radius': '50%',
    width: '50px',
    height: '50px'
};
const lightContainerStyle = {
    display: 'flex'
};
let LightMachine = class LightMachine {
    constructor() {
        this.colorRed = () => {
            this.color = 'red';
        };
        this.colorGreen = () => {
            this.color = 'green';
        };
        this.colorYellow = () => {
            this.color = 'yellow';
        };
        this.count = () => {
            this.transition('timer');
        };
    }
    componentDidLoad() {
        this.startCountdown();
    }
    componentDidUnload() {
        clearInterval(this.interval);
    }
    startCountdown() {
        this.interval = window.setInterval(this.count, 10000);
    }
    render() {
        const newLightStyle = Object.assign({}, lightStyle, { 'background-color': this.color });
        return (h("div", { style: lightContainerStyle },
            h("span", { style: newLightStyle })));
    }
    static get is() { return "light-machine"; }
    static get properties() { return {
        "color": {
            "state": true
        }
    }; }
};
LightMachine = __decorate([
    machine(lightMachine)
], LightMachine);

export { LightMachine };
