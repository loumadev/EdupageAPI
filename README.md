# EdupageAPI
This is an unofficial Node.js implementation of the Edupage API. This module is not maintained, authorized, or sponsored by Edupage. Edupage's internal API could change at any time, and break functionality of this module. If you find bugs, have any questions or suggestions for features, please let me know and submit an issue.

## Table of Contents
* [Overview](#overview)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Examples](#examples)
  * [Get lessons for a given date](#get-lessons-for-a-given-date)
  * [Get homework assignments for the next day](#get-lessons-for-a-given-date)
  * [Get timetables for specific date range](#get-timetables-for-specific-date-range)
  * [Sign into an online lesson](#sign-into-an-online-lesson)
  * [Send a message to the user](#send-a-message-to-the-user)
  * [Send a message with an attachment](#send-a-message-with-an-attachment)
  * [Get the material data and results of an assignment](#get-the-material-data-and-results-of-an-assignment)
  * [Post COVID-19 infectivity application](#post-covid-19-infectivity-application)
* [API](#api)

## Overview
**EdupageAPI** is a module to easily access and interact with your Edupage account. All the basic types like *students*, *teachers*, *subjects*, *timetables*, *messages* are stored into the groups with user-friendly API to get data and do basic actions (*obtaining lessons*, *replying to messages*...). You can also a send message marked as **Important**, which is not possible using the official Edupage application (unless you have an account with teacher privileges).

### Requirements
* Node.js v14.0.0+
* Edupage account

## Installation
```bash
npm i edupage-api
```

## Usage
The only thing you need to set up the API is to log in, like so:
```javascript
const {Edupage} = require("edupage-api");

// Create blank Edupage instance
const edupage = new Edupage();

// This will automatically create new User instance and
// fill in all arrays and properties inside `edupage`
edupage.login("username/email", "password").then(user => {
    // Currently logged user (`user`) can be also accessed by `edupage.user`

    // Here you can write your code...
}).catch(err => {
    // Catch errors
});
```
Most of the objects have `_data` property, which holds raw data fetched directly from Edupage servers so in case there are no parsed properties you are looking for, you can get raw data by accessing those `_data` properties and process it yourself.


## Examples
**Note:** In production, you should be handling Promise rejections by `promise.catch()` or `try ... catch`.

### Get lessons for a given date
This example shows how to obtain timetable (with lessons) for current date. Initially there are available 2 to 4 timetables only, but this method tries to automatically fetch and update given timetables.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get today's date for example
    const date = new Date();

    //Get timetable for `date`
    const timetable = await edupage.getTimetableForDate(date);

    //Get array with lessons for this timetable
    const lessons = timetable.lessons;

    console.log(lessons);
})();
```

### Get homework assignments for the next day
This simple snippet returns each homework and test happening the next day (from today) as an array of the assignments.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    //Get lessons
    const timetable = await edupage.getTimetableForDate(tomorrow);
    const lessons = timetable.lessons;

    //Collect assignments
    const homeworks = lessons.reduce((arr, lesson) => (arr.push(...lesson.assignments), arr), []);

    console.log(homeworks);
})();
```

### Get timetables for specific date range
If you need to access multiple timetables at once, you can use this method.

**Note:** You shouldn't be calling this method in loop for same date range, use `getTimetableForDate` method instead which reads from cache.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Choose a date range
    const from = new Date("2021-05-10");
    const to = new Date("2021-05-15");

    //Fetch array of the timetables
    //Note: This will also update `edupage.timetables` array
    const timetables = await edupage.fetchTimetablesForDates(from, to);

    console.log(timetables);
})();
```

### Sign into an online lesson
Using this simple snippet you can tell your teacher that you are present on the lesson.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get today's date for example
    const date = new Date();

    //Get timetable for today
    const timetable = await edupage.getTimetableForDate(date);

    //Get your lesson
    //Note: This will return second lesson in array, not second period.
    //      In case you want to access second period you may need:
    //      `timetable.lessons.find(e => e.period.id == "3")`
    const lesson = timetable.lessons[1];

    //You should check if the lesson is an online lesson
    if(lesson.isOnlineLesson) {
        //Sign it (this method may not be successful, in such case it will return `false`)
        const success = await lesson.signIntoLesson();

        console.log(success);
    }
})();
```

### Send a message to the user
This example shows how to send a simple message to another user.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get the user
    const classmate = edupage.students.find(e => e.firstname == "John" && e.lastname == "Smith");

    //Configure the message
    const options = {
        text: "Hello there!",   //Message content
        important: true         //Make this message marked as important
    };

    //Send the message
    await classmate.sendMessage(options);
})();
```

### Send a message with an attachment
This example shows how to send a message with an attachment(s) to another user.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get a user
    const teacher = edupage.teachers.find(e => e.firstname == "John" && e.lastname == "Smith");

    //Upload the attachment
    const attachment = await edupage.uploadAttachment("C:/Users/username/Documents/Homework.docx");

    //Configure the message
    const options = {
        text: "Sending my homework!",  //Message content
        attachments: [attachment]      //Array of attachments
    };

    //Send the message
    await teacher.sendMessage(options);
})();
```

### Get the material data and results of an assignment
Using this snippet you can access material data and/or results of an assignment. This method is not implemented yet, so you have to process it yourself.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get an assignment (you can search by title, id...)
    const assignment = edupage.assignments.find(e => e.title.startsWith("Surface integral of vector field"));

    //Get the data
    //Note: This returns RawDataObject (it might get implemented in the future)
    const {materialData, resultsData} = await assignment.getData();

    console.log(materialData, resultsData);
})();
```

### Post COVID-19 infectivity application
**🚨 This example is experimental, you should avoid using it in production until stable version!**

Are you annoyed sending each week a new infectivity application? You can make that programmatically now! The following snipped shows how to post Covid-19 infectivity application with current date.
```javascript
const {Edupage} = require("edupage-api");

const edupage = new Edupage();

(async () => {
    await edupage.login("username", "password");

    //Get an application you want to post
    const application = edupage.applications.find(e => e.id == "teacher_infectivity_2_20210517");

    //Get today's date
    const today = new Date();

    //Post the application
    const success = await application.post({
        date: Edupage.dateToString(today)    //Processing for the values is not supported, so you have to make it yourself
    });

    //Console.log the result (🚨 This might not be precise!)
    console.log(success);
})();
```

# API
Here you can find representations of all classes, interfaces and enums. In code, you shouldn't be creating any instances of the following classes except for `Edupage` class. All required classes are created internally. Most of the classes contain `Edupage` instance.

**Note:** following snippets are not actual valid code.

## API Contents
* [Classes](#classes)
  * [class ASC](#class-asc)
  * [class Application](#class-application)
  * [class Assignment](#class-assignment)
  * [class Attachment](#class-attachment)
  * [class Class](#class-class)
  * [class Classroom](#class-classroom)
  * [class Edupage](#class-edupage)
  * [class Grade](#class-grade)
  * [class Homework](#class-homework)
  * [class Lesson](#class-lesson)
  * [class Message](#class-message)
  * [class Parent](#class-parent)
  * [class Period](#class-period)
  * [class Plan](#class-plan)
  * [class RawData](#class-rawdata)
  * [class Season](#class-season)
  * [class Student](#class-student)
  * [class Subject](#class-subject)
  * [class Teacher](#class-teacher)
  * [class Test](#class-test)
  * [class Timetable](#class-timetable)
  * [class User](#class-user)
* [Interfaces](#interfaces)
  * [interface APIOptions](#interface-apioptions)
  * [interface MessageOptions](#interface-messageoptions)
  * [interface MessageReplyOptions](#interface-messagereplyoptions)
  * [interface RawDataObject](#interface-rawdataobject)
* [Enums](#enums)
  * [enum APIEndpoint](#enum-apiendpoint)
  * [enum APIStatus](#enum-apistatus)
  * [enum AssignmentType](#enum-assignmenttype)
  * [enum AssignmentGroup](#enum-assignmentgroup)
  * [enum EntityType](#enum-entitytype)
  * [enum Gender](#enum-gender)
  * [enum TimelineItemType](#enum-timelineitemtype)

## Classes

### class ASC
This class holds the basic information about a school and logged user.
```typescript
class ASC extends RawData {
    edupage: Edupage;

    loggedUser: string;          // UserString of the currently logger user
    loggedUserRights: any[];

    lang: string;                // Language code
    timezone: string;            // Example: "Europe/Bratislava"
    firstDayOfWeek: number;      // 0 = sunday
    weekendDays: number[];       // 0 = sunday

    schoolName: string;          // Long name of the school
    schoolCountry: string;       // Country code
    schoolyearTurnover: string;  // Example: "08-01"

    server: string;
    gsecHash: string;
    gpid?: string;
}
```

### class Application
**🚨 This is an experimental class, you should not be using this class in production**

This class holds the information about an application (e.g. Covid-19 infectivity)
```typescript
class Application extends RawData {
    edupage: Edupage;

    id: string;
    name: string;

    dateFrom: Date;
    dateTo: Date;

    parameters: string[];           // List of parameters to be passed to `Application.post(...)`
    
    availableFor: EntityType;       // Usually `ENTITY_TYPE.STUDENT` or `ENTITY_TYPE.TEACHER`

    isEnabled: boolean;             // Determines whether the application is enabled in your Edupage
    isTextOptional: boolean;		// Unknown property
    isAdvancedWorkflow: boolean;    // Unknown property
    isSimpleWorkflow: boolean;      // Unknown property

    // Creates draft for the application
    async createDraft(): Promise<string>;
    
    // Posts the application
    // 🚨 This method might not return accurate result
    static post(
        parameters: RawDataObject = {},     // Parameters from `Application.parameters`
        draftId?: string = null             // Draft ID (created internally if not provided)
    ): Promise<boolean>;
}
```

### class Assignment
This class holds the information about an assignment such as homework, test, presentation...
```typescript
class Assignment extends RawData {
    edupage: Edupage;

    id: string;
    superId: string;
    testId: string;
    hwkid: string;

    type: AssignmentType;
    owner: User | Teacher;   // Creator of the assignment
    subject: Subject;
    period: Period;
    grades: Grade[];

    creationDate: Date;      // Time when was the assignment created
    fromDate: Date;          // Time from when is the assignment available for students
    toDate: Date;            // Time until the assignment is available for students
    duration: number;        // Number of seconds for students to submit the assignment

    title: string;
    details: string;
    comment: string;
    result: string;

    state: string;
    stateUpdatedDate: Date;
    stateUpdatedBy: User | Teacher;

    cardsCount: number;
    answerCardsCount: number;

    isSeen: boolean;
    isFinished: boolean;

    async getData(): Promise<RawDataObject>;
    
    static from(
        data: RawDataObject,
        edupage: Edupage
    ): Assignment | Homework | Test;
}
```

### class Attachment
This class holds the information about an attachment.
```typescript
class Attachment extends RawData {
    edupage: Edupage;

    name: string;   // Name containing file extension
    src: string;    // Source url, absolute path
}
```

### class Class
This class holds basic the information about a school class.
```typescript
class Class extends RawData {
    edupage: Edupage;

    id: string;
    grade: number;  // e.g. first grade, second grade etc.
    name: string;
    short: string;

    classroom: Classroom;

    teacher?: Teacher;
    teacher2?: Teacher;
}
```

### class Classroom
This class holds basic the information about a classroom.
```typescript
class Classroom extends RawData {
    edupage: Edupage;

    id: string;
    name: string;
    short: string;

    cb_hidden: boolean;
}
```

### class Edupage
This is the main EdupageAPI class, containing all resources fetched and parsed from the Edupage servers.
You can access all properties and methods to obtain required data.
The property `_data` contains original raw data. (As well as some data which are not supported yet)
```typescript
class Edupage extends RawData {
    user: User | Teacher | Student;  // Gets assigned automatically after successful login() call

    students: Student[];
    teachers: Teacher[];
    parents: Parent[];

    plans: Plan[];
    classes: Class[];
    classrooms: Classroom[];
    
    seasons: Season[];
    periods: Period[];
    subjects: Subject[];
    timetables: Timetable[];

    timelineItems: Message[];       // Contains all timeline items (including confirmations)
    timeline: Message[];            // Contains only visible items (messages, assignments, grades...)
    assignments: Assignment[];      // Contains all assignments (homework assignments, tests and other)
    homeworks: Homework[];          // Contains assignments type of homework
    tests: Test[];                  // Contains assignments type of test

    ASC: ASC;

    year: number;
    baseUrl: string;                // Example: "https://example.edupage.org"

    getUserById(id: string): User | Teacher | Student | Parent | undefined;
    getUserByUserString(userString: string): User | Teacher | Student | Parent | undefined;
    getYearStart(time?: boolean = false): string; // Example: "2020-08-01" or "2020-08-01 00:00:00"

    async getTimetableForDate(date: Date): Promise<Timetable | undefined>;  // Note: Calls `fetchTimetablesForDates` method internally if the given timetable is missing
    
    async fetchTimetablesForDates(   // Fetches the timetables from Edupage (+caching and updating existing)
        fromDate: Date,
        toDate: Date
    ): Promise<Timetable[]>

    async login(
        username: string,
        password: string
    ): Promise<User | Teacher | Student>;
    
    async refresh(): void;                                        // Refreshes all values in current instance
    async refreshEdupage(_update?: boolean = true): void;         // Refreshes global Edupage data (such as teachers, classes, classrooms, subjects...)
    async refreshTimeline(_update?: boolean = true): void;        // Refreshes timeline data (messages, notifications...)
    async refreshCreatedItems(_update?: boolean = true): void;    // Refreshes timeline items data created by currently logged user
    async refreshGrades(_update?: boolean = true): void;          // Refreshes grades of currently logged  user

    _updateInternalValues(): void;                                // Updates all fields of the current instance (called internally after
                                                                  // any of the "refresh" methods, if `_update` is set to `true`)

    async uploadAttachment(filepath: string): Promise<Attachment>;
    async api(options: APIOptions): Promise<RawDataObject | string>;

    static compareDay(
        date1: Date | number | string,
        date2: Date | number | string
    ): boolean;

    static dateToString(            // Converts Date into string (Example: "2020-05-17")
        date: Date
    ): string;
}
```

### class Grade
This class holds the information about a student's grade.

**Note:** properties `points`, `maxPoints` and `percentage` are only available if `type == "3"`.
```typescript
class Grade extends RawData {
    edupage: Edupage;

    id: string;
    eventId: string;
    superId: string;

    type: string;
    state: string;
    provider: string;       // Usually "edupage"

    student: Student;
    teacher: Teacher;

    creationDate: Date;
    signedDate: Date;
    signedByParentDate: Date;

    plan: Plan;
    class: Class;
    classes: Class[];

    season: Season;
    subject: Subject;
    assignment: Assignment;

    title: string;
    short: string;
    date: string;

    value: string;          // Actual grade
    weight: number;         // Weight of the grade as decimal number (Example: 0.25)
    points?: number;        // Points gained
    maxPoints?: number;     // Max possible points
    percentage?: number;    // Ratio between gained points and maxPoints in percents
    average: string;        // Average gained points / grade in class

    isSigned: boolean;
    isClassified: boolean;
}
```

### class Homework
This is a wrapper class for the Assignment class
```typescript
class Homework extends Assignment {

}
```

### class Lesson
This class holds the information about a lesson.
```typescript
class Lesson extends RawData {
    edupage: Edupage;

    id: string;
    lid: string;

    students: Student[];
    teachers: Teacher[];

    classes: Class[];
    classrooms: Classroom[];

    date: Date;            // Starting time of the lesson
    period: Period;
    subject: Subject;
    
    assignments: Assignment[];
    onlineLessonURL: string;

    homeworkNote: string;
    absentNote: string;
    curriculum: string;

    isOnlineLesson: boolean;

    async signIntoLesson(): Promise<boolean>;
}
```

### class Message
This class holds the information about a message.
You can also do some basic actions like *replying*, *liking the message*, *starring the message*...
```typescript
class Message extends RawData {
    edupage: Edupage;

    id: string;
    otherId: string;
    type: TimelineItemType;

    owner: User | Teacher | Student | Parent;   // Sender or Author
    recipient: User | Teacher | Student | Parent | Plan | Class;
    recipientUserString: string;                // In some cases, the recipient cannot be parsed, so this property holds it's raw UserString
    participants: (User | Teacher | Student | Parent)[];
    participantsCount: number;

    creationDate: Date;          // Time when the message was created
    timelineDate: Date;          // Time on the timeline (when someone reacts to the message, it will get pushed at the top of the timeline)
    lastReplyDate: Date;         // Time of the last reply
    seenDate: Date;              // Time when the message has been seen (this will be always same as `creationDate` if the message is not important)
    likedDate: Date;
    doneDate: Date;

    likedBy: ({
        user: User | Teacher | Student | Parent,
        date: Date
    })[];
    
    seenBy: ({
        user: User | Teacher | Student | Parent,
        date: Date
    })[];

    text: string;
    title: string;
    likes: number;
    
    replyOf: Message;
    replies: Message[];
    repliesCount: number;

    attachments: Attachment[];
    assignment: Assignment;

    isRemoved: boolean;
    isReply: boolean;
    isImportant: boolean;
    isSeen: boolean;                  // This will be always true if the message is not important
    isLiked: boolean;
    isDone: boolean;
    isStarred: boolean;
    isWildcardRecipient: boolean;     // Determines whether exact recipient is known (you should be using `recipientUserString` if this is true)

    async markAsSeen(): Promise<void>;
    async markAsLiked(state?: boolean = true): Promise<boolean>;
    async markAsDone(state?: boolean = true): Promise<boolean>;
    async markAsStarred(state?: boolean = true): Promise<boolean>;

    async reply(options: MessageReplyOptions): void;
    async refresh(data?: RawDataObject = null): void;	// To refresh message content (e.g. replies) call this method (ignoring `data` paramenter)
}
```

### class Parent
This class holds the basic information about a parent.
```typescript
class Parent extends User {
    edupage: Edupage;

    id: string;
    userString: string;

    firstname: string;
    lastname: string;

    gender: GENDER;
}
```

### class Period
This class holds the information about a school period.
```typescript
class Period extends RawData {
    id: string;    // Starts from 1

    name: string;
    short: string;

    startTime: string;
    endTime: string;

    getInvalid(data?: {    //Creates new invalid Period
        id?: string?,
        name?: string,
        short?: string,
        startTime?: string,
        endTime?: string
    } = null): Period;
}
```

### class Plan
This class holds the information about a school Plan.
It's like a group of specific students for some subject.
```typescript
class Plan extends RawData {
    edupage: Edupage;

    id: string;
    otherId: string;
    customClassId: string;

    teacher: Teacher;
    teachers: Teacher[];
    students: Student[];

    changedDate: Date;
    approvedDate: Date;
    
    name: string;
    customName: string;
    classOrdering: number;

    year: number;
    season: Season;
    subject: Subject;
    classes: Class[];
    
    state: string;
    timetableGroup: string;
    settings: Object<string, any>;

    topicsCount: number;
    taughtCount: number;
    standardsCount: number;

    isEntireClass: boolean;
    isApproved: boolean;
    isPublic: boolean;
    isValid: boolean;
}
```

### class RawData
This is the base class for storing raw data fetched from Edupage servers.
It contains a single property - `_data`, this property is non-enumerable
```typescript
class RawData {
    _data: RawDataObject;
}
```

### class Season
This class holds the information about a school season.
It could be month, semester...
```typescript
class Season extends RawData {
    edupage: Edupage;

    id: string;
    index: number;      // Starting from 1 (e.g. first month of the school year)
    types: string[];    // ? Unknown property

    fromDate: Date;
    toDate: Date;

    name: string;
    halfYear: number;   // First or second semester
    supSeason: Season;  // Upper season (e.g. if `this` is the first month, this property will be first a half year)
    classificationSeason?: Season;

    isClassification: boolean;
}
```

### class Student
This class holds the information about a student.
```typescript
class Student extends User {
    edupage: Edupage;

    class: Class;
    number: number;           // ? Unknown property
    numberInClass: number;    // This is actual number in class

    parent1Id: string;
    parent2Id: string;
    parent3Id: string;

    parent1?: Parent;
    parent2?: Parent;
    parent3?: Parent;

    userString: string;

    getUserString(parents?: boolean = false): string;
}
```

### class Subject
This class holds the information about a subject.
```typescript
class Subject extends RawData {
    id: string;

    name: string;
    short: string;
}
```

### class Teacher
This class holds the information about a teacher.
```typescript
class Teacher extends User {
    edupage: Edupage;

    classroom: Classroom;
    short: string;
    
    userString: string;
    cb_hidden: number;     // ? Unknown property
}
```

### class Test
This is a wrapper class for the Assignment class.
```typescript
class Test extends Assignment {

}
```

### class Timetable
This class holds the information about a timetable.
Timetable for only single day, not entire week.
```typescript
class Timetable extends RawData {
    edupage: Edupage;

    date: Date;
    week: number;         // ? Unknown property (Maybe odd/even week?)
    lessons: Lesson[];
}
```

### class User
This class holds the information about a user.
Use `sendMessage` method to send message to the user.
```typescript
class User extends RawData {
    edupage: Edupage;

    id: string;
    origin: string;
    userString: string;

    dateFrom: Date;
    dateTo: Date;
    
    firstname: string;
    lastname: string;
    gender: Gender;
    email?: string;
    cookies?: CookieJar;
    credentials?: {
        username: string,
        password: string
    };

    isLoggedIn: boolean;
    isOut: boolean;

    getUserString(): string;

    async sendMessage(options: MessageOptions): Message;
    
    async login(
        username: string,
        password: string
    ): Promise<User>;

    static from(
        userString: string,
        data?: RawDataObject = {},
        edupage?: Edupage = null
    ): User | Teacher | Student | Parent;
}
```


## Interfaces

### interface APIOptions
Using this interface you can specify the API options.
```typescript
interface APIOptions {
    url: string | APIEndpoint;          // APIEndpoint is automatically resolved
    data?: (Object<string, any> | stream.Readable | Buffer | string) = {};
    headers?: Object<string, any> = {};
    method?: string = "POST";
    encodeBody?: boolean = true;        // Encode body as `form-urlencoded` using Edupage "special" encryption
    type?: "json" | "text" = "json";    // Response type
    autoLogin?: boolean = true;         // Log in the user automatically if they're logged out (e.g. expired session)
}
```

### interface MessageOptions
Using this interface you can specify the message options.
```typescript
interface MessageOptions {
    text: string;                       // Content of the message
    important?: boolean = false;        // Mark message as important
    parents?: boolean = false;          // Include parents
    attachments?: Attachment[] = [];
}
```

### interface MessageReplyOptions
Using this interface you can specify the message options for reply.
```typescript
interface MessageReplyOptions {
    text: string;                       //  Content of the reply
    recipient?: (User | Teacher | Student | Parent) = null;	// Send only to the exact user
    parents?: boolean = false;          // Include parents
    attachments?: Attachment[] = []
}
```

### interface RawDataObject
This interface is used to represent raw data fetched from the Edupage servers.
```typescript
interface RawDataObject {
  [property: string]: any;
}
```


## Enums

### enum APIEndpoint
This enum contains records about the API endpoints.
```typescript
enum APIEndpoint {
    DASHBOARD_GET_USER,
    DASHBOARD_SIGN_ONLINE_LESSON,
    TIMELINE_GET_DATA,
    TIMELINE_GET_REPLIES,        
    TIMELINE_GET_CREATED_ITEMS,  
    TIMELINE_CREATE_ITEM,        
    TIMELINE_CREATE_CONFIRMATION,
    TIMELINE_CREATE_REPLY,       
    TIMELINE_FLAG_HOMEWORK,      
    TIMELINE_UPLOAD_ATTACHMENT,
    ELEARNING_TEST_DATA,        
    ELEARNING_TEST_RESULTS,     
    ELEARNING_CARDS_DATA,       
    GRADES_DATA
}
```

### enum APIStatus
This enum contains records about the API response statuses.
```typescript
enum APIStatus {
    OK = "ok",
    FAIL = "fail"
}
```

### enum AssignmentType
This enum contains records about the assignment types.
```typescript
enum AssignmentType {
    HOMEWORK = "hw",
    ETEST_HOMEWORK = "etesthw",
    BIG_EXAM = "bexam",
    EXAM = "exam",
    SMALL_EXAM = "sexam",
    ORAL_EXAM = "oexam",
    REPORT_EXAM = "rexam",
    TESTING = "testing",
    TEST = "test",
    PROJECT_EXAM = "pexam",
    ETEST = "etest",
    ETEST_PRINT = "etestprint",
    ETEST_LESSON = "etestlesson",
    LESSON = "lekcia",
    PROJECT = "projekt",
    RESULT = "result",
    CURRICULUM = "ucivo",
    TIMELINE = "timeline"
}
```

### enum AssignmentGroup
This enum contains records about the assignments groups.
```typescript
enum AssignmentGroup {
    HOMEWORK = ["hw", "etesthw"],
    EXAM = ["bexam", "sexam", "oexam", "rexam", "testing"],
    TEST = ["test", "etest", "etestprint"],
    PROJECT = ["pexam", "projekt"],
    PRESENTATION = ["etestlesson", "lekcia"],
    OTHER = ["result", "ucivo", "timeline"]
}
```

### enum EntityType
This enum contains records about the entity types.
```typescript
enum EntityType {
    STUD_PLAN = "StudPlan",
    STUDENT = "Student",
    CUST_PLAN = "CustPlan",
    STUDENT_ONLY = "StudentOnly",
    STUD_CLASS = "StudTrieda",
    TEACHER = "Ucitel",
    ALL = "*",
    CLASS = "Trieda",
    STUDENT_ALL = "Student*",
    STUDENTONLY_ALL = "StudentOnly*",
    TEACHER_ALL = "Ucitel*",
    ADMIN = "Admin",
    PARENT = "Parent"
}
```

### enum Gender
This enum contains records about the genders.
```typescript
enum Gender {
    MALE = "M",
    FEMALE = "F"
}
```

### enum TimelineItemType
This enum contains records about the timeline item types.
```typescript
enum TimelineItemType {
    MESSAGE = "sprava",
    MESSAGE_TO_SUBTITUTER = "spravasuplujucemu",
    NOTICEBOARD = "nastenka",
    GRADE_ANNOUNCEMENT = "nastenka",
    GRADE = "znamka",
    NOTE = "vcelicka",
    HOMEWORK = "homework",
    HOMEWORK_STUDENT_STATE = "homework",
    ABSENCE_NOTE = "ospravedlnenka",
    ABSENCE_NOTE_REMINDER = "ospravedlnenka_reminder",
    PROCESS = "process",
    PROCESS_ADMIN = "processadmin",
    STUDENT_ABSENT = "student_absent",
    ACCIDENT = "accident",
    EVENT = "event",
    TIMETABLE = "timetable",
    SUBSTITUTION = "substitution",
    CANTEEN_MENU = "stravamenu",
    CANTEEN_CREDIT = "strava_kredit",
    CANTEEN_SUSPEND_REINSTATE_ORDERS = "strava_prerusObnovObj",
    CANTEEN_OPENING = "strava_vydaj",
    SURVEY = "anketa",
    PLAN = "plan",
    SETTINGS = "settings",
    ALBUM = "album",
    NEWS = "news",
    TEST_ASSIGNMENT = "testpridelenie",
    TEST_RESULT = "testvysledok",
    CHAT = "chat",
    CHECK_IN = "pipnutie",
    CONSULTATION_MESSAGE = "konzultaciemsg",
    CONSULTATION = "konzultacie",
    PAYMENTS = "payments",
    SIGN_IN = "signin",
    CURRICULUM = "ucivo",
    CURRICULUM_REMINDER = "ucivo_reminder",
    BLACKBOARD = "bb",
    STUDENT_PICKUP = "odchadzka",
    TIMETABLE_CLOUD_GENERATE = "ttcloudgen",
    CONFIRMATION = "confirmation",
    CONTEST = "contest"
}
```
