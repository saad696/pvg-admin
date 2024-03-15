import {
    LayoutOutlined,
    FlagOutlined,
    CodeOutlined,
    SettingOutlined,
    NotificationOutlined,
    UsergroupAddOutlined,
    ReadOutlined,
    MailOutlined,
    MessageOutlined,
    ContactsOutlined,
} from '@ant-design/icons';

export const sidebarMenus = [
    {
        name: 'Portfolio',
        icon: LayoutOutlined,
        visibility: ['admin', 'portfolio'],
        children: [
            {
                name: 'Basic Details',
                path: '/portfolio/basic-details',
                visibility: ['admin'],
                icon: null,
            },
            {
                name: 'Projects',
                path: '/portfolio/project',
                visibility: ['admin'],
                icon: null,
            },
            {
                name: 'Experience',
                path: '/portfolio/experience',
                visibility: ['admin'],
                icon: null,
            },
            {
                name: 'Blogs',
                path: '/portfolio/blog',
                visibility: ['admin'],
                icon: null,
            },
            {
                name: 'Contact',
                path: '/portfolio/contact',
                visibility: ['admin'],
                icon: null,
            },
        ],
    },
    {
        name: 'Vikin',
        visibility: ['admin', 'vikin'],
        icon: FlagOutlined,
        children: [
            {
                name: 'Host Rides',
                path: '/vikin/host-rides',
                visibility: ['vikin_admin', 'vikin_host', 'admin'],
                icon: FlagOutlined,
            },
            {
                name: 'Newsletter',
                path: '/vikin/newsletter',
                visibility: [
                    'vikin_admin',
                    'vikin_announcer',
                    'vikin_blog',
                    'admin',
                ],
                icon: MessageOutlined,
            },
            {
                name: 'Announcements',
                path: '/vikin/announcements',
                visibility: ['vikin_admin', 'vikin_announcer', 'admin'],
                icon: NotificationOutlined,
            },
            {
                name: 'Registered Users',
                path: '/vikin/users',
                visibility: ['vikin_admin'],
                icon: UsergroupAddOutlined,
            },

            {
                name: 'Send Emails',
                path: '/vikin/email',
                visibility: ['vikin_admin', 'vikin_announcer', 'admin'],
                icon: MailOutlined,
            },
            {
                name: 'Blogs',
                path: '/vikin/blog',
                visibility: ['vikin_admin', 'vikin_blog', 'admin'],
                icon: ReadOutlined,
            },
            {
                name: 'Contacts',
                path: '/vikin/contact',
                visibility: ['vikin_admin', 'vikin_announcer', 'admin'],
                icon: ContactsOutlined,
            },
        ],
    },
    {
        name: 'Graphyl',
        visibility: ['admin', 'graphyl'],
        icon: CodeOutlined,
        children: [
            {
                name: 'Basic Details',
                path: '/graphyl/basic-details',
                visibility: ['admin'],
                icon: null,
            },
        ],
    },
    {
        name: 'Settings',
        visibility: ['admin'],
        icon: SettingOutlined,
        children: [
            {
                name: 'Create User',
                path: '/create-user',
                visibility: ['admin'],
                icon: null,
            },
            {
                name: 'Create Tags',
                path: '/create-tags',
                visibility: ['admin'],
                icon: null,
            },
        ],
    },
];

export const roles = ['Admin', 'Portfolio', 'Vikin', 'Graphyl'];

export const subRoles = [
    'vikin_admin',
    'vikin_blog',
    'vikin_host',
    'vikin_announcer',
];

export const roleAccess = {
    admin: ['admin'],
    portfolio: ['admin', 'portfolio'],
    vikin: ['admin', 'vikin'],
    graphyl: ['admin', 'graphyl'],
    all: ['admin', 'portfolio', 'vikin', 'graphyl'],
};

export const defaultRoute: { [key: string]: string } = {
    portfolio: 'basic-details',
    vikin: 'host-rides',
    graphyl: 'basic-details',
};
export const regexp = {
    url: new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    ),
    mobile: new RegExp(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    ),
    imageUrl: new RegExp(/https?:\/\/.*\.(jpg|png|jpeg|gif|bmp|svg)/),
};

export const dateTimeFormats = {
    default: 'MMMM Do YYYY',
    default_with_time: 'MMMM Do YYYY (h:mm:ss a)',
    month_year: 'MMMM YYYY',
    elastic_format: 'YYYY-MM-DDThh:mm:ss',
};

export const vikinEmailTypes = {
    custom: 'custom',
    announcement: 'announcement',
    ride: 'vikin-new-ride',
};

export const tables = {
    basicDetails: 'basic-details',
    blogTags: 'blog-tags',
    userRoles: 'user-roles',
    userSubRoles: 'user-sub-roles',
    blogs: 'blogs',
    project: 'projects',
    experience: 'experience',
    contact: 'contacts',
    pageSize: 'pageSizes',
    rides: 'rides',
    vikinUsers: 'vikin_users',
    announcements: 'announcements',
    newsletter: 'newsletter',
    emailTransactions: 'email-transactions',
};

export const imageTypes = {
    array: [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/tiff',
        'image/bmp',
        'image/x-icon',
    ],
    string: 'image/jpg, image/jpeg, image/png, image/gif, image/webp, image/tiff, image/bmp, image/x-icon',
};

export const status = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DELETED: 'Deleted',
    COMPLETED: 'Completed',
    ONGOING: 'Ongoing',
    DEACTIVATED: 'Deactivated',
};

export const statusColor = {
    ACTIVE: 'success',
    INACTIVE: 'warning',
    DELETED: 'red',
    COMPLETED: 'success',
    ONGOING: 'processing',
};

export const rideStatuses = [
    'Active',
    'Inactive',
    'Ongoing',
    'Completed',
    'Deleted',
];

export const experienceFormOptions = {
    employment_type: ['Part Time', 'Full Time', 'Freelance'],
    location_type: ['Work from home', 'Work from office', 'Hybrid'],
};

export const tagsColor = [
    'processing',
    'success',
    'error',
    'warning',
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
];

export const skills = [
    'Java',
    'PHP',
    'Ruby',
    'C#',
    'C / C++',
    'SQL',
    'PL/SQL',
    'ASP .NET',
    'Objective-C',
    'Visual Basic',
    'JEE',
    'Spring',
    'Spring Security',
    'Spring Boot',
    'JPA',
    'Hibernate',
    'Flyway',
    'Swing',
    'JSF',
    'Apache Wicket',
    'Velocity',
    'GWT',
    'JXL',
    'Oracle Portal',
    'CodeIgniter',
    'Laravel',
    'Symphony',
    'Zend',
    'Yii',
    'WordPress',
    'Joomla',
    'Drupal',
    'Magento',
    'Prestashop',
    'Microsoft Visual Studio',
    'Telerik Framework',
    'Entity Framework',
    'ASP Web API',
    'WinForms',
    'ASP.NET MVC',
    'Neodynamic SDK',
    'ASP.NET',
    'Rails',
    'Capistrano',
    'RMagick',
    'Geokit',
    'RSpec',
    'Windows API',
    'ActiveX',
    'XCode',
    'wxWidgets',
    'STL',
    'WinDDK',
    'Qt Framework',
    'Microsoft CRM',
    'Angular',
    'React',
    'VueJS',
    'NextJS',
    'NuxtJS',
    'NodeJS',
    'JQuery',
    'ExtJS',
    'JSON',
    'MooTools',
    'ASP.NET Ajax control Toolkit',
    'Dojo',
    'Bootstrap',
    'Typescript',
    'D3.js',
    'XHTML',
    'HTML5',
    'XML',
    'XSL',
    'XPath',
    'XQuery',
    'SAX',
    'DOM',
    'StAX',
    'TinyMCE',
    'JW Player',
    'Highcharts',
    'amCharts',
    'Modernizr',
    'Oauth2 security',
    'Omniauth security',
    'React Native',
    'PhoneGap',
    'iPhone SDK',
    'Android SDK',
    'Xamarin',
    'JQuery Mobile',
    'Tableau',
    'Pentaho Business Inteligence',
    'Crystal Reports',
    'REST API',
    'Apache CXF',
    'Axis',
    'SOAP',
    'WSDL',
    'JAXB',
    'JAX-WS',
    'Apache Kafka',
    'ActiveMQ',
    'IBM MQ Series',
    'Eclipse',
    'Idea',
    'MS Visual Studio',
    'Aptana Studio',
    'Git',
    'SVN',
    'Rational ClearCase',
    'Rational Synergy',
    'MS Visual Source Safe',
    'Maven',
    'Ant',
    'Jenkins',
    'Bamboo',
    'MySQL',
    'PostgreSQL',
    'Oracle',
    'MS SQL Server',
    'Derby',
    'Lucene/SOLR/ElasticSearch',
    'MongoDB',
    'LDAP',
    'Apache Tomcat',
    'JBoss AS',
    'Jetty',
    'IBM WebShere',
    'Oracle Application Server',
    'WebLogic',
    'Windows Server IIS',
    'Nginx',
    'Docker',
    'Kubernetees',
    'Amazon Web Services',
    'Azure',
    'private cloud',
    'BizTalk',
    'SalesForce',
    'Jira',
    'Confluence',
    'MS Project',
    'ScrumDesk',
    'Top-down',
    'PERT',
    'Software-FMEA',
    'Agile',
    'Scrum',
    'Kanban',
    'Scrumban',
    'RUP',
    'DSDM',
    'Selenium',
    'Protractor',
    'Ranorex',
    'JMeter',
    'JBehave',
    'Testing Anywhere',
    'WebUI Test Studio',
    'TestComplete',
    'SOAP UI',
    'EasyMock',
    'Mockito',
    'jMock',
    'WebUI test Tool',
    'TCMS',
    'Cucumber',
    'ProjectLocker',
    'Redmine',
    'Rally',
    'Trac',
    'ActiveCollab',
    'Rational ClearQuest',
    'Bugzilla',
    'Bugzero',
    'Remedy',
    'Remix.js',
    'TestLink',
    'TestTrack',
    'Axure',
    'Adobe XD',
    'Invision',
    'Moqups',
    'SCSS',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Zeplin',
    'Google Polymer',
    'Dojo Toolkit',
    'jQuery',
    'midori',
    'Prototype JavaScript Framework',
    'AnyChart',
    'Babylon.js',
    'Chart.js',
    'Cytoscape',
    'FusionCharts',
    'Google Charts',
    'JavaScript InfoVis Toolkit',
    'p5.js',
    'CSS3',
    'Plotly',
    'Processing.js',
    'Raphaël',
    'RGraph',
    'seen.js',
    'Snap.svg',
    'SWFObject',
    'Teechart',
    'Three.js',
    'Velocity.js',
    'Verge3D',
    'Webix',
    'Angular (application platform) by Google',
    'AngularJS by Google',
    'Dojo Widgets',
    'Ext JS by Sencha',
    'Foundation by ZURB',
    'jQuery UI',
    'jQWidgets',
    'OpenUI5 by SAP',
    'Polymer (library) by Google',
    'qooxdoo',
    'React.js by Facebook',
    'Vue.js',
    'WinJS',
    'Svelte',
    'Glow',
    'Lively Kernel',
    'Script.aculo.us',
    'YUI Library',
    'Google Closure Library',
    'Joose',
    'JsPHP',
    "Microsoft's Ajax library",
    'MochiKit',
    'PDF.js',
    'Socket.IO',
    'Spry framework',
    'Underscore.js',
    'Backbone.js',
    'Echo',
    'Ember.js',
    'Enyo',
    'Express.js',
    'Ext JS',
    'Google Web Toolkit',
    'JavaScriptMVC',
    'JsRender/JsViews',
    'Knockout',
    'Meteor',
    'Mojito',
    'Next.js',
    'PureMVC',
    'React.js',
    'SproutCore',
    'Wakanda Framework',
    'Jasmine',
    'Mocha',
    'QUnit',
    'Unit.js',
    'Ant Design',
    'Material UI',
    'Semantic UI',
    'ShadCn',
    'jQuery Mobile',
    'Mustache',
    'Jinja-JS',
    'Twig.js',
    'Blockly',
    'Cannon.js',
    'MathJax',
    'TensorFlow',
    'Brain.js',
    'Go Lang',
    'GIT',
    'Bit bucket',
    'Rust',
    'Elixir',
    'Dart',
    'Flutter',
    'F#',
    'Scala',
    'Kotlin',
    'Swift',
    'Clojure',
    'Haskell',
    'Perl',
    'R',
    'SAS',
    'Matlab',
    'Julia',
    'Groovy',
    'Lua',
    'Cobol',
    'ABAP',
    'Ada',
    'Apex',
    'Assembly',
    'Bash/Shell',
    'Delphi/Object Pascal',
    'Erlang',
    'Fortran',
    'LabVIEW',
    'Lisp',
    'Pascal',
    'PowerShell',
    'Prolog',
    'RPG',
    'Scheme',
    'Scratch',
    'Shell',
    'VBA',
    'WebAssembly',
    'COBOL',
    'VHDL',
    'JCL',
    'PL/I',
    'ALGOL',
    'APL',
    'Bash',
    'bc',
    'C shell',
    'Caml',
    'CL (OS/400)',
    'Clipper',
    'CoffeeScript',
    'Common Lisp',
    'Crystal',
    'D',
    'Eiffel',
    'Elm',
    'Forth',
    'Hack',
    'Icon',
    'IDL',
    'Informix-4GL',
    'Interlisp',
    'J#',
    'Ladder Logic',
    'Logo',
    'ML',
    'Modula-2',
    'MUMPS',
    'NATURAL',
    'Nim',
    'OCaml',
    'OpenEdge ABL',
    'Oz',
    'Pure Data',
    'Racket',
    'REXX',
    'Ring',
    'RPG (OS/400)',
    'Simula',
    'Smalltalk',
    'Tcl',
    'Transact-SQL',
    'TypeScript',
    'VBScript',
    'Verilog',
    'Visual Basic .NET',
    'yacc',
    'Z shell',
    'Leadership',
    'Teamwork',
    'Communication',
    'Problem Solving',
    'Adaptability',
    'Interpersonal Skills',
    'Time Management',
    'Creativity',
    'Attention to Detail',
    'Self-motivation',
    'Resilience',
    'Initiative',
    'Patience',
    'Persuasion',
    'Active Listening',
    'Reliability',
    'Critical Thinking',
    'Empathy',
    'Learning Agility',
    'Negotiation',
    'Conflict Resolution',
    'Stress Management',
    'Business Etiquette',
    'Decision Making',
    'Flexibility',
    'Resourcefulness',
    'Analytical Thinking',
    'Cultural Intelligence',
    'Emotional Intelligence',
    'Collaboration',
    'Sales Ability',
    'Strategic Thinking',
    'Innovation',
    'Project Management',
    'Research',
    'Public Speaking',
    'Customer Service',
    'Technical Literacy',
    'Planning',
    'Computer/Technical Literacy',
    'Process Improvement',
    'Bilingual or Multilingual',
    'Conflict Management',
    'Data Analysis',
    'Dispute Resolution',
    'Meeting Management',
    'Digital Marketing',
    'Storytelling',
    'Social Media Management',
    'Soft Skills Training',
    'Hard Skills Training',
    'Coaching',
    'Crisis Management',
    'Change Management',
    'Javascript',
    'ES6',
    'Client/Stakeholder Handling',
    'Project Delivery',
    'Chakra UI',
    'Firebase',
    'SupaBase',
    'Tailwind',
    'Redis',
    'GraphQl',
    'Strapi',
    'Apache ECharts',
];
