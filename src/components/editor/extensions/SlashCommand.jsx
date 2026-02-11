import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import SlashCommandList from '../menus/SlashCommandList';
import {
    FaHeading, FaListUl, FaListOl, FaQuoteRight, FaImage, FaYoutube, FaCode, FaCheckSquare
} from 'react-icons/fa';
import { RiH1, RiH2, RiH3 } from 'react-icons/ri';

const getSuggestionItems = ({ query }) => {
    return [
        {
            title: 'Heading 1',
            description: 'Big section heading',
            icon: <RiH1 />,
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run();
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading',
            icon: <RiH2 />,
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run();
            },
        },
        {
            title: 'Heading 3',
            description: 'Small section heading',
            icon: <RiH3 />,
            command: ({ editor, range }) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 3 })
                    .run();
            },
        },
        {
            title: 'Bullet List',
            description: 'Create a simple bullet list',
            icon: <FaListUl />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a list with numbering',
            icon: <FaListOl />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: 'Task List',
            description: 'Track tasks with a todo list',
            icon: <FaCheckSquare />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: 'Blockquote',
            description: 'Capture a quote',
            icon: <FaQuoteRight />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
            },
        },
        {
            title: 'Code Block',
            description: 'Capture a code snippet',
            icon: <FaCode />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
            },
        },
        {
            title: 'Image',
            description: 'Insert an image from URL',
            icon: <FaImage />,
            command: ({ editor, range }) => {
                const url = window.prompt('Enter image URL');
                if (url) {
                    editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
                }
            },
        },
        {
            title: 'YouTube',
            description: 'Embed a YouTube video',
            icon: <FaYoutube />,
            command: ({ editor, range }) => {
                const url = window.prompt('Enter YouTube URL');
                if (url) {
                    editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run();
                }
            },
        },
        {
            title: 'Admonition (Info)',
            description: 'Insert an info box',
            icon: <FaInfoCircle />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('admonition', { type: 'info' }).run();
            },
        },
        {
            title: 'Admonition (Danger)',
            description: 'Insert a danger alert',
            icon: <FaInfoCircle className='text-red-500' />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('admonition', { type: 'danger' }).run();
            },
        },
        {
            title: 'Spoiler',
            description: 'Insert a collapsible section',
            icon: <FaEyeSlash />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).setNode('spoiler').run();
            },
        },
    ].filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
            return item.title.toLowerCase().includes(query.toLowerCase());
        }
        return true;
    });
};

const renderSuggestion = () => {
    let component;
    let popup;

    return {
        onStart: (props) => {
            component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) {
                return;
            }

            popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'dark', // We will need to style this if not handled by standard CSS
            });
        },
        onUpdate(props) {
            component.updateProps(props);

            if (!props.clientRect) {
                return;
            }

            popup[0].setProps({
                getReferenceClientRect: props.clientRect,
            });
        },
        onKeyDown(props) {
            if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
            }
            return component.ref?.onKeyDown(props);
        },
        onExit() {
            popup[0].destroy();
            component.destroy();
        },
    };
};

const SlashCommand = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export { SlashCommand, getSuggestionItems, renderSuggestion };

export default SlashCommand.configure({
    suggestion: {
        items: getSuggestionItems,
        render: renderSuggestion,
    },
});
