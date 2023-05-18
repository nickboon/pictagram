
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    new Set();

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    // Needs to be written like this to pass the tree-shake-test
    'WeakMap' in globals ? new WeakMap() : undefined;
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    new Map();

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const _boolean_attributes = [
        'allowfullscreen',
        'allowpaymentrequest',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'inert',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected'
    ];
    /**
     * List of HTML boolean attributes (e.g. `<input disabled>`).
     * Source: https://html.spec.whatwg.org/multipage/indices.html
     */
    new Set([..._boolean_attributes]);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class MessageService {
    	static messageSentEventName = 'messageSent';
    	static updateEventName = 'update';
    	static socket = io();

    	constructor(messageRecievedHandler, updateHandler) {
    		MessageService.socket.on(MessageService.updateEventName, updateHandler);
    		MessageService.socket.on(
    			MessageService.messageSentEventName,
    			messageRecievedHandler
    		);
    	}

    	sendMessage(message, messageSenthander) {
    		MessageService.socket.emit(
    			MessageService.messageSentEventName,
    			message,
    			messageSenthander
    		);
    	}
    }

    //https://en.wikipedia.org/wiki/Unicode_block

    function toArray(first, last) {
    	return Array.from({ length: last - first + 1 }, (e, i) => i + first);
    }

    const blocks = [
    	{
    		name: 'Alchemical Symbols',
    		codes: toArray(0x1f700, 0x1f773),
    	},
    	{
    		name: 'Arrows',
    		codes: toArray(0x2190, 0x21ff),
    	},
    	{
    		name: 'Dingbats',
    		codes: toArray(0x2701, 0x27bf),
    	},
    	{
    		name: 'Domino Tiles',
    		codes: toArray(0x1f030, 0x1f093),
    	},
    	{
    		name: 'Emoticons',
    		codes: toArray(0x1f600, 0x1f64f),
    	},
    	{
    		name: 'Geometric Shapes',
    		codes: toArray(0x25a0, 0x25ff),
    	},
    	{
    		name: 'Miscellaneous Symbols',
    		codes: toArray(0x2600, 0x26ff),
    	},
    	{
    		name: 'Miscellaneous Symbols and Arrows',
    		codes: [...toArray(0x2b00, 0x2b4c), ...toArray(0x2b50, 0x2b59)],
    	},
    	{
    		name: 'Miscellaneous Symbols and Pictographs',
    		codes: [
    			...toArray(0x1f300, 0x1f321),
    			...toArray(0x1f324, 0x1f393),
    			...toArray(0x1f396, 0x1f397),
    			...toArray(0x1f399, 0x1f39b),
    			...toArray(0x1f39e, 0x1f3f0),
    			...toArray(0x1f3f3, 0x1f3f5),
    			...toArray(0x1f3f7, 0x1f53b),
    			...toArray(0x1f549, 0x1f54e),
    			...toArray(0x1f550, 0x1f567),
    			...toArray(0x1f56f, 0x1f570),
    			...toArray(0x1f573, 0x1f57a),
    			...toArray(0x1f587, 0x1f587),
    			...toArray(0x1f58a, 0x1f58d),
    			...toArray(0x1f590, 0x1f590),
    			...toArray(0x1f595, 0x1f596),
    			...toArray(0x1f5a4, 0x1f5a5),
    			...toArray(0x1f5a8, 0x1f5a8),
    			...toArray(0x1f5b1, 0x1f5b2),
    			...toArray(0x1f5bc, 0x1f5bc),
    			...toArray(0x1f5c2, 0x1f5c4),
    			...toArray(0x1f5d1, 0x1f5d3),
    			...toArray(0x1f5dc, 0x1f5de),
    			...toArray(0x1f5e1, 0x1f5e1),
    			...toArray(0x1f5e3, 0x1f5e3),
    			...toArray(0x1f5e8, 0x1f5e8),
    			...toArray(0x1f5ef, 0x1f5ef),
    			...toArray(0x1f5f3, 0x1f5f3),
    			...toArray(0x1f5fa, 0x1f5ff),
    		],
    	},
    	{
    		name: 'Miscellaneous Technical',
    		codes: toArray(0x2300, 0x23ff),
    	},
    	{
    		name: 'Playing Cards',
    		codes: toArray(0x2660, 0x2667),
    	},
    	{
    		name: 'Supplemental Symbols and Pictographs',
    		codes: [...toArray(0x1f90c, 0x1f93a), ...toArray(0x1f93c, 0x1f9ff)],
    	},
    	{
    		name: 'Symbols and Pictographs Extended-A',
    		codes: [
    			...toArray(0x1fa70, 0x1fa74),
    			...toArray(0x1fa78, 0x1fa7c),
    			...toArray(0x1fa80, 0x1fa86),
    			...toArray(0x1fa90, 0x1faac),
    			...toArray(0x1fab0, 0x1faba),
    			...toArray(0x1fac0, 0x1fac5),
    			...toArray(0x1fad0, 0x1fad9),
    			...toArray(0x1fae0, 0x1fae7),
    			...toArray(0x1faf0, 0x1faf6),
    		],
    	},
    	{
    		name: 'Transport and Map Symbols',
    		codes: [
    			...toArray(0x1f680, 0x1f6c5),
    			...toArray(0x1f6cb, 0x1f6d2),
    			...toArray(0x1f6d5, 0x1f6d7),
    			...toArray(0x1f6dd, 0x1f6e5),
    			...toArray(0x1f6e9, 0x1f6e9),
    			...toArray(0x1f6eb, 0x1f6ec),
    			...toArray(0x1f6f0, 0x1f6f0),
    			...toArray(0x1f6f3, 0x1f6fc),
    		],
    	},
    	{
    		name: 'Yijing Hexagram Symbols',
    		codes: toArray(0x4dc0, 0x4dff),
    	},
    ];

    /* src\Symbol.svelte generated by Svelte v3.59.1 */

    const file$5 = "src\\Symbol.svelte";

    function create_fragment$5(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "symbol");
    			add_location(span, file$5, 6, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = /*text*/ ctx[0];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Symbol', slots, []);
    	let { code } = $$props;
    	const text = `&#${code};&#xFE0E;`;

    	$$self.$$.on_mount.push(function () {
    		if (code === undefined && !('code' in $$props || $$self.$$.bound[$$self.$$.props['code']])) {
    			console.warn("<Symbol> was created without expected prop 'code'");
    		}
    	});

    	const writable_props = ['code'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Symbol> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('code' in $$props) $$invalidate(1, code = $$props.code);
    	};

    	$$self.$capture_state = () => ({ code, text });

    	$$self.$inject_state = $$props => {
    		if ('code' in $$props) $$invalidate(1, code = $$props.code);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, code];
    }

    let Symbol$1 = class Symbol extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { code: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Symbol",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get code() {
    		throw new Error("<Symbol>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<Symbol>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    };

    /* src\Button.svelte generated by Svelte v3.59.1 */

    const file$4 = "src\\Button.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", /*type*/ ctx[0]);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*selected*/ ctx[1] ? 'selected' : '') + " svelte-jvkxes"));
    			button.disabled = /*disabled*/ ctx[2];
    			add_location(button, file$4, 6, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1) {
    				attr_dev(button, "type", /*type*/ ctx[0]);
    			}

    			if (!current || dirty & /*selected*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*selected*/ ctx[1] ? 'selected' : '') + " svelte-jvkxes"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*disabled*/ 4) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = 'button' } = $$props;
    	let { selected = false } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['type', 'selected', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, selected, disabled });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		type,
    		selected,
    		disabled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { type: 0, selected: 1, disabled: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Message {
    	constructor(symbols = []) {
    		this.symbols = symbols;
    		this.date = Date();
    	}

    	get isEmpty() {
    		return this.symbols.length === 0;
    	}
    }

    /* src\SymbolSelect.svelte generated by Svelte v3.59.1 */
    const file$3 = "src\\SymbolSelect.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (50:2) <Button     on:click={onSymbolClick}     on:mouseenter={onMouseenter}     on:mouseleave={onMouseleave}    >
    function create_default_slot$2(ctx) {
    	let symbol;
    	let t;
    	let current;

    	symbol = new Symbol$1({
    			props: { code: /*code*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(symbol.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(symbol, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(symbol.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(symbol.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(symbol, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(50:2) <Button     on:click={onSymbolClick}     on:mouseenter={onMouseenter}     on:mouseleave={onMouseleave}    >",
    		ctx
    	});

    	return block;
    }

    // (49:1) {#each codes as code}
    function create_each_block$3(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*onSymbolClick*/ ctx[0]);
    	button.$on("mouseenter", /*onMouseenter*/ ctx[1]);
    	button.$on("mouseleave", /*onMouseleave*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(49:1) {#each codes as code}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let each_value = /*codes*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-a31cdr");
    			add_location(div, file$3, 47, 0, 974);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*onSymbolClick, onMouseenter, onMouseleave, codes*/ 15) {
    				each_value = /*codes*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function createSymbol(
    	text,
    fontSize = 24,
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    angle = 0,
    opacity = 1
    ) {
    	return {
    		text,
    		fontSize,
    		x,
    		y,
    		scaleX,
    		scaleY,
    		angle,
    		opacity
    	};
    }

    function shuffle(unshuffled) {
    	return unshuffled.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SymbolSelect', slots, []);
    	let { message = new Message() } = $$props;
    	let { viewed } = $$props;

    	function onSymbolClick(event) {
    		$$invalidate(4, message.symbols = [...message.symbols, createSymbol(event.target.innerText)], message);
    	}

    	function onMouseenter(event) {
    		$$invalidate(5, viewed = event.target.innerText);
    	}

    	function onMouseleave(event) {
    		$$invalidate(5, viewed = false);
    	}

    	const codes = shuffle(blocks.map(block => block.codes).flat());

    	$$self.$$.on_mount.push(function () {
    		if (viewed === undefined && !('viewed' in $$props || $$self.$$.bound[$$self.$$.props['viewed']])) {
    			console.warn("<SymbolSelect> was created without expected prop 'viewed'");
    		}
    	});

    	const writable_props = ['message', 'viewed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SymbolSelect> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(4, message = $$props.message);
    		if ('viewed' in $$props) $$invalidate(5, viewed = $$props.viewed);
    	};

    	$$self.$capture_state = () => ({
    		blocks,
    		Symbol: Symbol$1,
    		Button,
    		Message,
    		message,
    		viewed,
    		createSymbol,
    		shuffle,
    		onSymbolClick,
    		onMouseenter,
    		onMouseleave,
    		codes
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(4, message = $$props.message);
    		if ('viewed' in $$props) $$invalidate(5, viewed = $$props.viewed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onSymbolClick, onMouseenter, onMouseleave, codes, message, viewed];
    }

    class SymbolSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { message: 4, viewed: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SymbolSelect",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get message() {
    		throw new Error("<SymbolSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<SymbolSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewed() {
    		throw new Error("<SymbolSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewed(value) {
    		throw new Error("<SymbolSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\MessageToolbar.svelte generated by Svelte v3.59.1 */
    const file$2 = "src\\MessageToolbar.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (102:0) {#if messageLength > 0}
    function create_if_block$1(ctx) {
    	let div1;
    	let ul;
    	let t0;
    	let span;
    	let t1;
    	let div0;
    	let button0;
    	let t2;
    	let button1;
    	let t3;
    	let button2;
    	let t4;
    	let button3;
    	let t5;
    	let button4;
    	let t6;
    	let button5;
    	let t7;
    	let button6;
    	let t8;
    	let button7;
    	let t9;
    	let button8;
    	let t10;
    	let button9;
    	let t11;
    	let button10;
    	let t12;
    	let button11;
    	let t13;
    	let button12;
    	let t14;
    	let button13;
    	let t15;
    	let button14;
    	let t16;
    	let button15;
    	let current;
    	let each_value = /*message*/ ctx[0].symbols;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button0 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*onGrow*/ ctx[3]);

    	button1 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*onShrink*/ ctx[4]);

    	button2 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*onShiftLeft*/ ctx[9]);

    	button3 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button3.$on("click", /*onShiftRight*/ ctx[10]);

    	button4 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button4.$on("click", /*onShiftUp*/ ctx[11]);

    	button5 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button5.$on("click", /*onShiftDown*/ ctx[12]);

    	button6 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button6.$on("click", /*onNudgeLeft*/ ctx[5]);

    	button7 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button7.$on("click", /*onNudgeRight*/ ctx[6]);

    	button8 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button8.$on("click", /*onNudgeUp*/ ctx[7]);

    	button9 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button9.$on("click", /*onNudgeDown*/ ctx[8]);

    	button10 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button10.$on("click", /*onRotateCcw*/ ctx[14]);

    	button11 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button11.$on("click", /*onRotateCw*/ ctx[13]);

    	button12 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button12.$on("click", /*onFlipX*/ ctx[15]);

    	button13 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button13.$on("click", /*onFlipY*/ ctx[16]);

    	button14 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button14.$on("click", /*onDecreaseOpacity*/ ctx[17]);

    	button15 = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button15.$on("click", /*onDelete*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			span = element("span");
    			t1 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t2 = space();
    			create_component(button1.$$.fragment);
    			t3 = space();
    			create_component(button2.$$.fragment);
    			t4 = space();
    			create_component(button3.$$.fragment);
    			t5 = space();
    			create_component(button4.$$.fragment);
    			t6 = space();
    			create_component(button5.$$.fragment);
    			t7 = space();
    			create_component(button6.$$.fragment);
    			t8 = space();
    			create_component(button7.$$.fragment);
    			t9 = space();
    			create_component(button8.$$.fragment);
    			t10 = space();
    			create_component(button9.$$.fragment);
    			t11 = space();
    			create_component(button10.$$.fragment);
    			t12 = space();
    			create_component(button11.$$.fragment);
    			t13 = space();
    			create_component(button12.$$.fragment);
    			t14 = space();
    			create_component(button13.$$.fragment);
    			t15 = space();
    			create_component(button14.$$.fragment);
    			t16 = space();
    			create_component(button15.$$.fragment);
    			attr_dev(ul, "class", "svelte-dffeav");
    			add_location(ul, file$2, 103, 2, 2121);
    			attr_dev(span, "class", "spacer svelte-dffeav");
    			add_location(span, file$2, 121, 2, 2507);
    			attr_dev(div0, "class", "tools svelte-dffeav");
    			add_location(div0, file$2, 122, 2, 2534);
    			attr_dev(div1, "class", "toolbar svelte-dffeav");
    			add_location(div1, file$2, 102, 1, 2096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div1, t0);
    			append_dev(div1, span);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t2);
    			mount_component(button1, div0, null);
    			append_dev(div0, t3);
    			mount_component(button2, div0, null);
    			append_dev(div0, t4);
    			mount_component(button3, div0, null);
    			append_dev(div0, t5);
    			mount_component(button4, div0, null);
    			append_dev(div0, t6);
    			mount_component(button5, div0, null);
    			append_dev(div0, t7);
    			mount_component(button6, div0, null);
    			append_dev(div0, t8);
    			mount_component(button7, div0, null);
    			append_dev(div0, t9);
    			mount_component(button8, div0, null);
    			append_dev(div0, t10);
    			mount_component(button9, div0, null);
    			append_dev(div0, t11);
    			mount_component(button10, div0, null);
    			append_dev(div0, t12);
    			mount_component(button11, div0, null);
    			append_dev(div0, t13);
    			mount_component(button12, div0, null);
    			append_dev(div0, t14);
    			mount_component(button13, div0, null);
    			append_dev(div0, t15);
    			mount_component(button14, div0, null);
    			append_dev(div0, t16);
    			mount_component(button15, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message, setSelected, onMouseenter, onMouseleave*/ 1835009) {
    				each_value = /*message*/ ctx[0].symbols;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			const button5_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    			const button6_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button6_changes.$$scope = { dirty, ctx };
    			}

    			button6.$set(button6_changes);
    			const button7_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button7_changes.$$scope = { dirty, ctx };
    			}

    			button7.$set(button7_changes);
    			const button8_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button8_changes.$$scope = { dirty, ctx };
    			}

    			button8.$set(button8_changes);
    			const button9_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button9_changes.$$scope = { dirty, ctx };
    			}

    			button9.$set(button9_changes);
    			const button10_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button10_changes.$$scope = { dirty, ctx };
    			}

    			button10.$set(button10_changes);
    			const button11_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button11_changes.$$scope = { dirty, ctx };
    			}

    			button11.$set(button11_changes);
    			const button12_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button12_changes.$$scope = { dirty, ctx };
    			}

    			button12.$set(button12_changes);
    			const button13_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button13_changes.$$scope = { dirty, ctx };
    			}

    			button13.$set(button13_changes);
    			const button14_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button14_changes.$$scope = { dirty, ctx };
    			}

    			button14.$set(button14_changes);
    			const button15_changes = {};

    			if (dirty & /*$$scope*/ 536870912) {
    				button15_changes.$$scope = { dirty, ctx };
    			}

    			button15.$set(button15_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			transition_in(button6.$$.fragment, local);
    			transition_in(button7.$$.fragment, local);
    			transition_in(button8.$$.fragment, local);
    			transition_in(button9.$$.fragment, local);
    			transition_in(button10.$$.fragment, local);
    			transition_in(button11.$$.fragment, local);
    			transition_in(button12.$$.fragment, local);
    			transition_in(button13.$$.fragment, local);
    			transition_in(button14.$$.fragment, local);
    			transition_in(button15.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			transition_out(button6.$$.fragment, local);
    			transition_out(button7.$$.fragment, local);
    			transition_out(button8.$$.fragment, local);
    			transition_out(button9.$$.fragment, local);
    			transition_out(button10.$$.fragment, local);
    			transition_out(button11.$$.fragment, local);
    			transition_out(button12.$$.fragment, local);
    			transition_out(button13.$$.fragment, local);
    			transition_out(button14.$$.fragment, local);
    			transition_out(button15.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(button3);
    			destroy_component(button4);
    			destroy_component(button5);
    			destroy_component(button6);
    			destroy_component(button7);
    			destroy_component(button8);
    			destroy_component(button9);
    			destroy_component(button10);
    			destroy_component(button11);
    			destroy_component(button12);
    			destroy_component(button13);
    			destroy_component(button14);
    			destroy_component(button15);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(102:0) {#if messageLength > 0}",
    		ctx
    	});

    	return block;
    }

    // (107:5) <Button        selected={symbol.isSelected}        on:click={() => {         setSelected(index);        }}        on:mouseenter={() => {         onMouseenter(index);        }}        on:mouseleave={onMouseleave}       >
    function create_default_slot_16(ctx) {
    	let span;
    	let t_value = /*symbol*/ ctx[26].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "symbol");
    			add_location(span, file$2, 116, 6, 2414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1 && t_value !== (t_value = /*symbol*/ ctx[26].text + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(107:5) <Button        selected={symbol.isSelected}        on:click={() => {         setSelected(index);        }}        on:mouseenter={() => {         onMouseenter(index);        }}        on:mouseleave={onMouseleave}       >",
    		ctx
    	});

    	return block;
    }

    // (105:3) {#each message.symbols as symbol, index}
    function create_each_block$2(ctx) {
    	let li;
    	let button;
    	let t;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[22](/*index*/ ctx[28]);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[23](/*index*/ ctx[28]);
    	}

    	button = new Button({
    			props: {
    				selected: /*symbol*/ ctx[26].isSelected,
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler);
    	button.$on("mouseenter", mouseenter_handler);
    	button.$on("mouseleave", /*onMouseleave*/ ctx[20]);

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(button.$$.fragment);
    			t = space();
    			attr_dev(li, "class", "svelte-dffeav");
    			add_location(li, file$2, 105, 4, 2176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(button, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};
    			if (dirty & /*message*/ 1) button_changes.selected = /*symbol*/ ctx[26].isSelected;

    			if (dirty & /*$$scope, message*/ 536870913) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(105:3) {#each message.symbols as symbol, index}",
    		ctx
    	});

    	return block;
    }

    // (124:3) <Button on:click={onGrow}>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("+");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(124:3) <Button on:click={onGrow}>",
    		ctx
    	});

    	return block;
    }

    // (125:3) <Button on:click={onShrink}>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("-");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(125:3) <Button on:click={onShrink}>",
    		ctx
    	});

    	return block;
    }

    // (126:3) <Button on:click={onShiftLeft}>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↞︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(126:3) <Button on:click={onShiftLeft}>",
    		ctx
    	});

    	return block;
    }

    // (127:3) <Button on:click={onShiftRight}>
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↠︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(127:3) <Button on:click={onShiftRight}>",
    		ctx
    	});

    	return block;
    }

    // (128:3) <Button on:click={onShiftUp}>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↟︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(128:3) <Button on:click={onShiftUp}>",
    		ctx
    	});

    	return block;
    }

    // (129:3) <Button on:click={onShiftDown}>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↡︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(129:3) <Button on:click={onShiftDown}>",
    		ctx
    	});

    	return block;
    }

    // (130:3) <Button on:click={onNudgeLeft}>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("←︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(130:3) <Button on:click={onNudgeLeft}>",
    		ctx
    	});

    	return block;
    }

    // (131:3) <Button on:click={onNudgeRight}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("→︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(131:3) <Button on:click={onNudgeRight}>",
    		ctx
    	});

    	return block;
    }

    // (132:3) <Button on:click={onNudgeUp}>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↑︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(132:3) <Button on:click={onNudgeUp}>",
    		ctx
    	});

    	return block;
    }

    // (133:3) <Button on:click={onNudgeDown}>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↓︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(133:3) <Button on:click={onNudgeDown}>",
    		ctx
    	});

    	return block;
    }

    // (134:3) <Button on:click={onRotateCcw}>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↶︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(134:3) <Button on:click={onRotateCcw}>",
    		ctx
    	});

    	return block;
    }

    // (135:3) <Button on:click={onRotateCw}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("↷︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(135:3) <Button on:click={onRotateCw}>",
    		ctx
    	});

    	return block;
    }

    // (136:3) <Button on:click={onFlipX}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("⬗");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(136:3) <Button on:click={onFlipX}>",
    		ctx
    	});

    	return block;
    }

    // (137:3) <Button on:click={onFlipY}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("⬘");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(137:3) <Button on:click={onFlipY}>",
    		ctx
    	});

    	return block;
    }

    // (138:3) <Button on:click={onDecreaseOpacity}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("👻︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(138:3) <Button on:click={onDecreaseOpacity}>",
    		ctx
    	});

    	return block;
    }

    // (139:3) <Button on:click={onDelete}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("🗑︎");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(139:3) <Button on:click={onDelete}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*messageLength*/ ctx[1] > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*messageLength*/ ctx[1] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*messageLength*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const shiftPx = 10;

    function instance$2($$self, $$props, $$invalidate) {
    	let messageLength;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageToolbar', slots, []);
    	let { message = new Message() } = $$props;
    	let { group = false } = $$props;
    	let selectedIndex = 0;

    	function onDelete() {
    		$$invalidate(0, message.symbols = message.symbols.filter(symbol => symbol != message.symbols[selectedIndex]), message);
    	}

    	function onGrow() {
    		$$invalidate(0, message.symbols[selectedIndex].fontSize++, message);
    	}

    	function onShrink() {
    		$$invalidate(0, message.symbols[selectedIndex].fontSize--, message);
    	}

    	function onNudgeLeft() {
    		$$invalidate(0, message.symbols[selectedIndex].x--, message);
    	}

    	function onNudgeRight() {
    		$$invalidate(0, message.symbols[selectedIndex].x++, message);
    	}

    	function onNudgeUp() {
    		$$invalidate(0, message.symbols[selectedIndex].y--, message);
    	}

    	function onNudgeDown() {
    		$$invalidate(0, message.symbols[selectedIndex].y++, message);
    	}

    	function onShiftLeft() {
    		$$invalidate(0, message.symbols[selectedIndex].x -= shiftPx, message);
    	}

    	function onShiftRight() {
    		$$invalidate(0, message.symbols[selectedIndex].x += shiftPx, message);
    	}

    	function onShiftUp() {
    		$$invalidate(0, message.symbols[selectedIndex].y -= shiftPx, message);
    	}

    	function onShiftDown() {
    		$$invalidate(0, message.symbols[selectedIndex].y += shiftPx, message);
    	}

    	function onRotateCw() {
    		$$invalidate(0, message.symbols[selectedIndex].angle++, message);
    	}

    	function onRotateCcw() {
    		$$invalidate(0, message.symbols[selectedIndex].angle--, message);
    	}

    	function onFlipX() {
    		$$invalidate(0, message.symbols[selectedIndex].scaleX *= -1, message);
    	}

    	function onFlipY() {
    		$$invalidate(0, message.symbols[selectedIndex].scaleY *= -1, message);
    	}

    	function onDecreaseOpacity() {
    		$$invalidate(
    			0,
    			message.symbols[selectedIndex].opacity = message.symbols[selectedIndex].opacity <= 0.2
    			? 1
    			: message.symbols[selectedIndex].opacity - 0.1,
    			message
    		);
    	}

    	function setSelected(index) {
    		selectedIndex = index;
    		message.symbols.map(symbol => symbol.isSelected = false);
    		$$invalidate(0, message.symbols[index].isSelected = true, message);
    	}

    	function onMouseenter(index) {
    		$$invalidate(21, group = index);
    	}

    	function onMouseleave() {
    		$$invalidate(21, group = false);
    	}

    	function onChange(messageLength) {
    		if (messageLength) setSelected(messageLength - 1);
    	}

    	const writable_props = ['message', 'group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageToolbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => {
    		setSelected(index);
    	};

    	const mouseenter_handler = index => {
    		onMouseenter(index);
    	};

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('group' in $$props) $$invalidate(21, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Message,
    		message,
    		group,
    		shiftPx,
    		selectedIndex,
    		onDelete,
    		onGrow,
    		onShrink,
    		onNudgeLeft,
    		onNudgeRight,
    		onNudgeUp,
    		onNudgeDown,
    		onShiftLeft,
    		onShiftRight,
    		onShiftUp,
    		onShiftDown,
    		onRotateCw,
    		onRotateCcw,
    		onFlipX,
    		onFlipY,
    		onDecreaseOpacity,
    		setSelected,
    		onMouseenter,
    		onMouseleave,
    		onChange,
    		messageLength
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('group' in $$props) $$invalidate(21, group = $$props.group);
    		if ('selectedIndex' in $$props) selectedIndex = $$props.selectedIndex;
    		if ('messageLength' in $$props) $$invalidate(1, messageLength = $$props.messageLength);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*message*/ 1) {
    			$$invalidate(1, messageLength = message.symbols.length);
    		}

    		if ($$self.$$.dirty & /*messageLength*/ 2) {
    			onChange(messageLength);
    		}
    	};

    	return [
    		message,
    		messageLength,
    		onDelete,
    		onGrow,
    		onShrink,
    		onNudgeLeft,
    		onNudgeRight,
    		onNudgeUp,
    		onNudgeDown,
    		onShiftLeft,
    		onShiftRight,
    		onShiftUp,
    		onShiftDown,
    		onRotateCw,
    		onRotateCcw,
    		onFlipX,
    		onFlipY,
    		onDecreaseOpacity,
    		setSelected,
    		onMouseenter,
    		onMouseleave,
    		group,
    		click_handler,
    		mouseenter_handler
    	];
    }

    class MessageToolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { message: 0, group: 21 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageToolbar",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get message() {
    		throw new Error("<MessageToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<MessageToolbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<MessageToolbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Message.svelte generated by Svelte v3.59.1 */
    const file$1 = "src\\Message.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (12:0) {#if !message.isEmpty}
    function create_if_block(ctx) {
    	let div;
    	let each_value = /*message*/ ctx[0].symbols;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "positionable_container svelte-na8rs");
    			add_location(div, file$1, 12, 1, 229);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*grouped, message*/ 3) {
    				each_value = /*message*/ ctx[0].symbols;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(12:0) {#if !message.isEmpty}",
    		ctx
    	});

    	return block;
    }

    // (14:2) {#each message.symbols as symbol, index}
    function create_each_block$1(ctx) {
    	let span;
    	let t_value = /*symbol*/ ctx[3].text + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = "symbol" + /*grouped*/ ctx[1](/*index*/ ctx[5]) + " svelte-na8rs");
    			set_style(span, "font-size", /*symbol*/ ctx[3].fontSize + "px");
    			set_style(span, "opacity", /*symbol*/ ctx[3].opacity);
    			set_style(span, "transform", "translate(" + /*symbol*/ ctx[3].x + "pt, " + /*symbol*/ ctx[3].y + "pt) rotate(" + /*symbol*/ ctx[3].angle + "deg) scaleX(" + /*symbol*/ ctx[3].scaleX + ") scaleY(" + /*symbol*/ ctx[3].scaleY + ")");
    			add_location(span, file$1, 14, 3, 314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1 && t_value !== (t_value = /*symbol*/ ctx[3].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*grouped*/ 2 && span_class_value !== (span_class_value = "symbol" + /*grouped*/ ctx[1](/*index*/ ctx[5]) + " svelte-na8rs")) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*message*/ 1) {
    				set_style(span, "font-size", /*symbol*/ ctx[3].fontSize + "px");
    			}

    			if (dirty & /*message*/ 1) {
    				set_style(span, "opacity", /*symbol*/ ctx[3].opacity);
    			}

    			if (dirty & /*message*/ 1) {
    				set_style(span, "transform", "translate(" + /*symbol*/ ctx[3].x + "pt, " + /*symbol*/ ctx[3].y + "pt) rotate(" + /*symbol*/ ctx[3].angle + "deg) scaleX(" + /*symbol*/ ctx[3].scaleX + ") scaleY(" + /*symbol*/ ctx[3].scaleY + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(14:2) {#each message.symbols as symbol, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*message*/ ctx[0].isEmpty && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*message*/ ctx[0].isEmpty) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let grouped;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Message', slots, []);
    	let { message = new Message() } = $$props;
    	let { group } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (group === undefined && !('group' in $$props || $$self.$$.bound[$$self.$$.props['group']])) {
    			console.warn("<Message> was created without expected prop 'group'");
    		}
    	});

    	const writable_props = ['message', 'group'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    	};

    	$$self.$capture_state = () => ({ Message, message, group, grouped });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('grouped' in $$props) $$invalidate(1, grouped = $$props.grouped);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*group*/ 4) {
    			$$invalidate(1, grouped = function (index) {
    				return group === index ? ` grouped` : '';
    			});
    		}
    	};

    	return [message, grouped, group];
    }

    class Message_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { message: 0, group: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message_1",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get message() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Message>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Message>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (50:2) <Button type="submit" disabled={isSubmitDisabled}>
    function create_default_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "📨︎";
    			attr_dev(span, "class", "large symbol svelte-ub2rjv");
    			add_location(span, file, 50, 3, 1246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(50:2) <Button type=\\\"submit\\\" disabled={isSubmitDisabled}>",
    		ctx
    	});

    	return block;
    }

    // (59:5) {#each message.symbols as symbol}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*symbol*/ ctx[5].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "symbol positionable svelte-ub2rjv");
    			set_style(span, "font-size", /*symbol*/ ctx[5].fontSize + "px");
    			set_style(span, "opacity", /*symbol*/ ctx[5].opacity);
    			set_style(span, "transform", "translate(" + /*symbol*/ ctx[5].x + "pt, " + /*symbol*/ ctx[5].y + "pt) rotate(" + /*symbol*/ ctx[5].angle + "deg) scaleX(" + /*symbol*/ ctx[5].scaleX + ") scaleY(" + /*symbol*/ ctx[5].scaleY + ")");
    			add_location(span, file, 59, 6, 1509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 8 && t_value !== (t_value = /*symbol*/ ctx[5].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*messages*/ 8) {
    				set_style(span, "font-size", /*symbol*/ ctx[5].fontSize + "px");
    			}

    			if (dirty & /*messages*/ 8) {
    				set_style(span, "opacity", /*symbol*/ ctx[5].opacity);
    			}

    			if (dirty & /*messages*/ 8) {
    				set_style(span, "transform", "translate(" + /*symbol*/ ctx[5].x + "pt, " + /*symbol*/ ctx[5].y + "pt) rotate(" + /*symbol*/ ctx[5].angle + "deg) scaleX(" + /*symbol*/ ctx[5].scaleX + ") scaleY(" + /*symbol*/ ctx[5].scaleY + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(59:5) {#each message.symbols as symbol}",
    		ctx
    	});

    	return block;
    }

    // (55:2) {#each messages as message}
    function create_each_block(ctx) {
    	let li;
    	let span;
    	let t0_value = /*message*/ ctx[1].date.toString().slice(0, 24) + "";
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let each_value_1 = /*message*/ ctx[1].symbols;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(span, "class", "smalltext svelte-ub2rjv");
    			add_location(span, file, 56, 4, 1353);
    			attr_dev(div, "class", "positionable_container svelte-ub2rjv");
    			add_location(div, file, 57, 4, 1427);
    			attr_dev(li, "class", "svelte-ub2rjv");
    			add_location(li, file, 55, 3, 1344);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, t0);
    			append_dev(li, t1);
    			append_dev(li, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 8 && t0_value !== (t0_value = /*message*/ ctx[1].date.toString().slice(0, 24) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*messages*/ 8) {
    				each_value_1 = /*message*/ ctx[1].symbols;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(55:2) {#each messages as message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0_value = (/*viewed*/ ctx[0] || 'Pictagram') + "";
    	let t0;
    	let t1;
    	let symbolselect;
    	let updating_message;
    	let updating_viewed;
    	let t2;
    	let messagetoolbar;
    	let updating_message_1;
    	let updating_group;
    	let t3;
    	let message_1;
    	let updating_group_1;
    	let t4;
    	let form;
    	let button;
    	let t5;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;

    	function symbolselect_message_binding(value) {
    		/*symbolselect_message_binding*/ ctx[7](value);
    	}

    	function symbolselect_viewed_binding(value) {
    		/*symbolselect_viewed_binding*/ ctx[8](value);
    	}

    	let symbolselect_props = {};

    	if (/*message*/ ctx[1] !== void 0) {
    		symbolselect_props.message = /*message*/ ctx[1];
    	}

    	if (/*viewed*/ ctx[0] !== void 0) {
    		symbolselect_props.viewed = /*viewed*/ ctx[0];
    	}

    	symbolselect = new SymbolSelect({
    			props: symbolselect_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(symbolselect, 'message', symbolselect_message_binding));
    	binding_callbacks.push(() => bind(symbolselect, 'viewed', symbolselect_viewed_binding));

    	function messagetoolbar_message_binding(value) {
    		/*messagetoolbar_message_binding*/ ctx[9](value);
    	}

    	function messagetoolbar_group_binding(value) {
    		/*messagetoolbar_group_binding*/ ctx[10](value);
    	}

    	let messagetoolbar_props = {};

    	if (/*message*/ ctx[1] !== void 0) {
    		messagetoolbar_props.message = /*message*/ ctx[1];
    	}

    	if (/*group*/ ctx[2] !== void 0) {
    		messagetoolbar_props.group = /*group*/ ctx[2];
    	}

    	messagetoolbar = new MessageToolbar({
    			props: messagetoolbar_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(messagetoolbar, 'message', messagetoolbar_message_binding));
    	binding_callbacks.push(() => bind(messagetoolbar, 'group', messagetoolbar_group_binding));

    	function message_1_group_binding(value) {
    		/*message_1_group_binding*/ ctx[11](value);
    	}

    	let message_1_props = { message: /*message*/ ctx[1] };

    	if (/*group*/ ctx[2] !== void 0) {
    		message_1_props.group = /*group*/ ctx[2];
    	}

    	message_1 = new Message_1({ props: message_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(message_1, 'group', message_1_group_binding));

    	button = new Button({
    			props: {
    				type: "submit",
    				disabled: /*isSubmitDisabled*/ ctx[4],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*messages*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(symbolselect.$$.fragment);
    			t2 = space();
    			create_component(messagetoolbar.$$.fragment);
    			t3 = space();
    			create_component(message_1.$$.fragment);
    			t4 = space();
    			form = element("form");
    			create_component(button.$$.fragment);
    			t5 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-ub2rjv");
    			toggle_class(h1, "symbol", /*symbol*/ ctx[5]);
    			add_location(h1, file, 44, 1, 979);
    			attr_dev(form, "class", "svelte-ub2rjv");
    			add_location(form, file, 48, 1, 1147);
    			attr_dev(ul, "class", "svelte-ub2rjv");
    			add_location(ul, file, 53, 1, 1306);
    			attr_dev(main, "class", "svelte-ub2rjv");
    			add_location(main, file, 43, 0, 971);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			mount_component(symbolselect, main, null);
    			append_dev(main, t2);
    			mount_component(messagetoolbar, main, null);
    			append_dev(main, t3);
    			mount_component(message_1, main, null);
    			append_dev(main, t4);
    			append_dev(main, form);
    			mount_component(button, form, null);
    			append_dev(main, t5);
    			append_dev(main, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[6]), false, true, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*viewed*/ 1) && t0_value !== (t0_value = (/*viewed*/ ctx[0] || 'Pictagram') + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*symbol*/ 32) {
    				toggle_class(h1, "symbol", /*symbol*/ ctx[5]);
    			}

    			const symbolselect_changes = {};

    			if (!updating_message && dirty & /*message*/ 2) {
    				updating_message = true;
    				symbolselect_changes.message = /*message*/ ctx[1];
    				add_flush_callback(() => updating_message = false);
    			}

    			if (!updating_viewed && dirty & /*viewed*/ 1) {
    				updating_viewed = true;
    				symbolselect_changes.viewed = /*viewed*/ ctx[0];
    				add_flush_callback(() => updating_viewed = false);
    			}

    			symbolselect.$set(symbolselect_changes);
    			const messagetoolbar_changes = {};

    			if (!updating_message_1 && dirty & /*message*/ 2) {
    				updating_message_1 = true;
    				messagetoolbar_changes.message = /*message*/ ctx[1];
    				add_flush_callback(() => updating_message_1 = false);
    			}

    			if (!updating_group && dirty & /*group*/ 4) {
    				updating_group = true;
    				messagetoolbar_changes.group = /*group*/ ctx[2];
    				add_flush_callback(() => updating_group = false);
    			}

    			messagetoolbar.$set(messagetoolbar_changes);
    			const message_1_changes = {};
    			if (dirty & /*message*/ 2) message_1_changes.message = /*message*/ ctx[1];

    			if (!updating_group_1 && dirty & /*group*/ 4) {
    				updating_group_1 = true;
    				message_1_changes.group = /*group*/ ctx[2];
    				add_flush_callback(() => updating_group_1 = false);
    			}

    			message_1.$set(message_1_changes);
    			const button_changes = {};
    			if (dirty & /*isSubmitDisabled*/ 16) button_changes.disabled = /*isSubmitDisabled*/ ctx[4];

    			if (dirty & /*$$scope*/ 2097152) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (dirty & /*messages*/ 8) {
    				each_value = /*messages*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(symbolselect.$$.fragment, local);
    			transition_in(messagetoolbar.$$.fragment, local);
    			transition_in(message_1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(symbolselect.$$.fragment, local);
    			transition_out(messagetoolbar.$$.fragment, local);
    			transition_out(message_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(symbolselect);
    			destroy_component(messagetoolbar);
    			destroy_component(message_1);
    			destroy_component(button);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let symbol;
    	let isSubmitDisabled;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const messenger = new MessageService(onMessageReceived, onUpdate);
    	let message = new Message();
    	let viewed = false;
    	let group = false;
    	let messages = [];

    	function reset() {
    		$$invalidate(4, isSubmitDisabled = false);
    		$$invalidate(1, message.symbols.length = 0, message);
    	}

    	function onUpdate(update) {
    		$$invalidate(3, messages = update);
    	}

    	function onMessageReceived(recievedMessage) {
    		$$invalidate(3, messages = [recievedMessage, ...messages]);
    	}

    	function onMessageSent(error) {
    		reset();
    		if (error) return console.log(error);
    	}

    	function onSubmit() {
    		$$invalidate(4, isSubmitDisabled = true);
    		$$invalidate(1, message.date = Date(), message);
    		messenger.sendMessage(message, onMessageSent);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function symbolselect_message_binding(value) {
    		message = value;
    		$$invalidate(1, message);
    	}

    	function symbolselect_viewed_binding(value) {
    		viewed = value;
    		$$invalidate(0, viewed);
    	}

    	function messagetoolbar_message_binding(value) {
    		message = value;
    		$$invalidate(1, message);
    	}

    	function messagetoolbar_group_binding(value) {
    		group = value;
    		$$invalidate(2, group);
    	}

    	function message_1_group_binding(value) {
    		group = value;
    		$$invalidate(2, group);
    	}

    	$$self.$capture_state = () => ({
    		MessageService,
    		SymbolSelect,
    		MessageToolbar,
    		Message: Message_1,
    		Button,
    		MessageObject: Message,
    		messenger,
    		message,
    		viewed,
    		group,
    		messages,
    		reset,
    		onUpdate,
    		onMessageReceived,
    		onMessageSent,
    		onSubmit,
    		isSubmitDisabled,
    		symbol
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('viewed' in $$props) $$invalidate(0, viewed = $$props.viewed);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('messages' in $$props) $$invalidate(3, messages = $$props.messages);
    		if ('isSubmitDisabled' in $$props) $$invalidate(4, isSubmitDisabled = $$props.isSubmitDisabled);
    		if ('symbol' in $$props) $$invalidate(5, symbol = $$props.symbol);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*viewed*/ 1) {
    			$$invalidate(5, symbol = viewed);
    		}

    		if ($$self.$$.dirty & /*message*/ 2) {
    			$$invalidate(4, isSubmitDisabled = message.isEmpty);
    		}
    	};

    	return [
    		viewed,
    		message,
    		group,
    		messages,
    		isSubmitDisabled,
    		symbol,
    		onSubmit,
    		symbolselect_message_binding,
    		symbolselect_viewed_binding,
    		messagetoolbar_message_binding,
    		messagetoolbar_group_binding,
    		message_1_group_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({ target: document.body });

    return app;

})();
//# sourceMappingURL=bundle.js.map
