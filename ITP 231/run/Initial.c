#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_LENGTH_COMMAND 300

#define MAX_NO_TASKS 100

#define MAX_LENGTH_TITLE 100
#define MAX_LENGTH_DESCRIPTION 200
#define MAX_LENGTH_TIME 33

#define WEEK_CELL_FIRST_COL_WIDTH 10
#define WEEK_CELL_OTHER_COL_WIDTH 20

enum Status {IN_PROGRESS, DONE, ARCHIVED};
char * status_name[] = {"In Progress", "Done", "Archived"};
enum CommandType {ADD, EDIT, SHOW, DELETE, QUIT, INVALID};
char * command_name[] = {"ADD", "EDIT", "SHOW", "DELETE", "QUIT", "INVALID"};

struct Task {
    int num;
    char title[MAX_LENGTH_TITLE+1];
    char description[MAX_LENGTH_DESCRIPTION+1];
    char time[MAX_LENGTH_TIME+1];
    enum Status status;
};

void printTask(struct Task * task) {
    printf("--------------------------------------------\n");
    printf("Num: #%d. Title: %s\n", task->num, task->title);
    printf("Description: %s\n", task->description);
    printf("Status: %s\n", status_name[task->status]);
    printf("--------------------------------------------\n");
}

void printUnsupportedTime(struct Task * task) {
    printf("----- Show week view -----\n");
    printf("Error: Unsupported time with non-zero minutes: %s\n", task->time);
    printf("In Task:\n");
    printTask(task);
}
struct Task tasklist[MAX_NO_TASKS];
int no_tasks = 0;   
// ------ Begin: Student Answer ------
//Requirement 1//
enum CommandType getCommandType(const char * command) {
    char firstWord[MAX_LENGTH_COMMAND+1]; //Create 1 array to store command type
    sscanf(command, "%s", firstWord); //Store command type: command has command type at the firstWord so I use "%s", it will store all the string till ' ' or '\0'
    for (int i = 0; i < strlen(firstWord); i++){
        if (firstWord[i] >= 'a' && firstWord[i] <= 'z') {
            firstWord[i] = firstWord[i] - 32;
        }
    } //The command type string can be aDd/add/eDiT/,... so i use strupr to capitalize the string
    if (strcmp(firstWord, "ADD") == 0) { //Compare the command type string with the string "ADD", the function strcmp will return false if 2 strings are the same
        return ADD; //If the function returns false, which means 2 strings are similar, this if-statement will return enum CommandType "ADD"
    } 
    else if (strcmp(firstWord, "EDIT") == 0) { //Same with "ADD"
        return EDIT;
    } 
    else if (strcmp(firstWord, "SHOW") == 0) { //Same with "ADD"
        return SHOW;
    } 
    else if (strcmp(firstWord, "DELETE") == 0) { //Same with "ADD"
        return DELETE;
    } 
    else if (strcmp(firstWord, "QUIT") == 0) { //Same with "ADD"
        return QUIT;
    }

    return INVALID; //If the if-statement above didn't return anything, so the command type is invalid
}
//End Requirement 1//
//Requirement 2//
    //Format Add command: Add [<title>] [<description>] [<time>]
void getTitleFromAdd(char * command, char * out_title) {
    char* start = strchr(command, '[') + 1; //Find the ptr to the first characer '[' in the command
    char* end = strchr(start, ']'); //Find the ptr to the first characer ']' in the command
    strncpy(out_title, start, end - start); //Copy the string between ptr start and ptr end, which is <title>, to the string out_title
    out_title[end - start] = '\0'; //Set the last character of the string to \0
}
void getDescriptionFromAdd(char * command, char * out_description) {
    char* start = strchr(command, '[') + 1; //Find the ptr to the first characer '[' in the command
    start = strchr(start + 1, '[') + 1; //Find the ptr to the second characer '[' in the command
    char* end = strchr(start, ']'); //Find the ptr to the second characer ']' in the command
    strncpy(out_description, start, end - start); //Copy the string between ptr start and ptr end, which is <description>, to the string out_description
    out_description[end - start] = '\0'; //Set the last character of the string to \0
}
void getTimeFromAdd(char * command, char * out_time) {
    char* start = strchr(command, '['); //Find the ptr to the first characer '[' in the command
    start = strchr(start + 1, '[') + 1; //Find the ptr to the second characer '[' in the command
    start = strchr(start + 1, '[') + 1; ////Find the ptr to the third characer '[' in the command
    char* end = strchr(start, ']'); //Find the ptr to the third characer ']' in the command
    for (int i = 0; i < end - start; i++){ //Copy the string between ptr start and ptr end, which is <time>, to the string out_time
        out_time[i] = start[i];
    }
}
//End Requirement 2//
//Requirement 3//
int checkTitle(char * raw_title) {
    if (strlen(raw_title) > MAX_LENGTH_TITLE) { //If title's length > max length then return title's length
        return strlen(raw_title); //Return title's length
    }
    for (int i = 0; i < strlen(raw_title); i++) { //Check every character in the title, if it's invalid then return the position of the character (i)
        char c = raw_title[i];
        if (i == 0 && c == ' ') { //If the title starts with ' ' then return i
            return i;
        }
        if (i == strlen(raw_title) - 1 && c == ' ') { //If the title ends up with ' ' then return i
            return i;
        }
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == ' ' || c == ',' || c == '.' || c == '-' || c == ':' || c == '|' || c == '/')) { //If the character doesn't satisfy the requirement's format then return i
            return i;
        }
    }
    return -1; //If the title is valid then return -1
}
//End Requirement 3//
//Requirement 4//
int checkDescription(char * raw_description) { //Same with requirement 3
    if (strlen(raw_description) > MAX_LENGTH_DESCRIPTION) {
        return strlen(raw_description);
    }
    for (int i = 0; i < strlen(raw_description); i++) {
        char c = raw_description[i];
        if (i == 0 && c == ' ') {
            return i;
        }
        if (i == strlen(raw_description) - 1 && c == ' ') {
            return i;
        }
        if (!((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == ' ' || c == ',' || c == '.' || c == '-' || c == ':' || c == '|' || c == '/')) {
            return i;
        }
    }
    return -1;
}
//End Requirement 4//
//Requirement 5//
// 2 added fuction to help define checkTime()
int isLeapYear(int year) { //Use to check if the parameter is a leap year or not
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) return 1; //If it's a leap year((divided by 4 and not divided by 100) or (divided by 400)) then return 1 
    else return 0; //If it's not a leap year then return 0
}
int isValidDateTime(int hh, int mm, int dd, int mo, int yyyy) {
    if (hh < 0 || hh > 23) return abs(hh) + 1100; 
    if (mm < 0 || mm > 59) return abs(mm) + 2100;
    int maxDays;
    if (mo == 2) {
        maxDays = isLeapYear(yyyy) ? 29 : 28;
    } 
    else if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
        maxDays = 30;
    } 
    else if (mo == 1 || mo == 3 || mo == 5 || mo == 7 || mo == 8 || mo == 10 || mo == 12) {
        maxDays = 31;
    } 
    else {
        return abs(mo) + 4100;
    }
    if (dd < 1 || dd > maxDays) return abs(dd) + 3100;
    if (yyyy <= 0) return abs(yyyy) + 510000; 
    return -1;
}
int checkTime(char* raw_time) {
    int hh, mm, dd, mo, yyyy;
    int hh2, mm2, dd2, mo2, yyyy2;
    sscanf(raw_time, "%d:%d|%d/%d/%d-%d:%d|%d/%d/%d", &hh, &mm, &dd, &mo, &yyyy, &hh2, &mm2, &dd2, &mo2, &yyyy2);
    
    int result1 = isValidDateTime(hh, mm, dd, mo, yyyy);
    if (result1 != -1) return result1;

    int result2 = isValidDateTime(hh2, mm2, dd2, mo2, yyyy2);
    if (result2 != -1 && result1 < 100000) return result2 + 100;
    else if (result2 >= 100000) return result2 + 10000;

    if (yyyy2 < yyyy || (yyyy2 == yyyy && (mo2 < mo || (mo2 == mo && (dd2 < dd || (dd2 == dd && (hh2 < hh || (hh2 == hh && mm2 < mm)))))))) return 0;
    
    return -1;
}
//End Requirement 5//
//Requirement 6//
void getTitleFromEdit(char * command, char * out_title){
    char* start = strchr(command, '[') + 1;
    char* end = strchr(start, ']');
    strncpy(out_title, start, end - start);
    out_title[end - start] = '\0';
}
void getDescriptionFromEdit(char * command, char * out_description){
    char* start = strchr(command, '[') + 1;
    char* end = strchr(start, ']');
    strncpy(out_description, start, end - start);
    out_description[end - start] = '\0';
}
void getTimeFromEdit(char * command, char * out_time){
    char* start = strchr(command, '[') + 1;
    char* end = strchr(start, ']');
    strncpy(out_time, start, end - start);
    for (int i = 0; i< end - start; i++){
        out_time[i] = start[i];
    }
    out_time[end - start] = '\0';
}
//End Requirement 6//
//Requirement 7//
int getNumFromCommand(char * command){
    char* start = NULL;
    if (strchr(command, '#')) start = strchr(command, '#') + 1; 
    else if (strchr(command, '%')) start = strchr(command, '%') + 1;
    else return -1;
    int num = atoi(start);
    if (num < 1){
        return 0;
    }
    return num;
}
//End Requirement 7//
//Requirement 8//
int getFieldFromEdit(char * edit_cmd){
    char* start = strchr(edit_cmd, ' ') + 1;
    start = strchr(start + 1, ' ') + 1;
    char* end = strchr(start, ':');
    char cloneEdit[12] = "";
    for (int i = 0; i < end - start; i++){
        if (i > 11) break;
        cloneEdit[i] = start[i];
    }
    cloneEdit[strlen(cloneEdit)] = '\0';
    if (strcmp(cloneEdit, "title") == 0) {
        return 1;
    } 
    else if (strcmp(cloneEdit, "description") == 0) {
        return 2;
    } 
    else if (strcmp(cloneEdit, "time") == 0) {
        return 3;
    } 
    else if (strcmp(cloneEdit, "status") == 0) {
        return 4;
    } 
    else {
        return 0;
    }
}
//End Requirement 8//
//Requirement 9//
enum Status getStatusFromEdit(char * edit_cmd){
    char* start = strchr(edit_cmd, '[') + 1;
    if (*start == 'I' || *start == 'i') return 0;
    if (*start == 'D' || *start == 'd') return 1;
    if (*start == 'A' || *start == 'a') return 2;
}
//End Requirement 9//
//Requirement 10//
void printAllTasks(struct Task * array_tasks, int no_tasks){
    struct Task* taskPtr = array_tasks;
    for(int i = 0; i < no_tasks; i++){
        printTask(taskPtr);
        ++taskPtr;
    }
}
//End Requirement 10//
//Requirement 11//
void printTaskByNum(struct Task * array_tasks, int no_tasks,int num){
    if (num > no_tasks) return;
    printTask(&array_tasks[num - 1]);
}
//End Requirement 11//
//Requirement 12//
void printHeadTasks(struct Task * array_tasks, int no_tasks, int quan){
    struct Task* taskPtr = array_tasks;
    if (quan <= 0) return;
    if (quan < no_tasks){
        for(int i = 0; i < quan; i++){
            printTask(&array_tasks[i]);
        }
    }
    else if (quan >= no_tasks){
        struct Task* taskPtr = array_tasks;
        for(int i = 0; i < no_tasks; i++){
            printTask(taskPtr);
            ++taskPtr;
        }
    }
}
//End Requirement 12//
//Requirement 13//
void printTailTasks(struct Task * array_tasks, int no_tasks, int quan){
    struct Task* taskPtr = array_tasks;
    if (quan <= 0) return;
    if (quan < no_tasks){
        for(int i = 0; i < quan; i++){
            printTask(&array_tasks[no_tasks - quan + i]);
        }
    }
    else if (quan >= no_tasks){
        struct Task* taskPtr = array_tasks;
        for(int i = 0; i < no_tasks; i++){
            printTask(taskPtr);
            ++taskPtr;
        }
    }
}
//End Requirement 13//
//Requirement 14//
void printFilteredTasksByTitle(struct Task * array_tasks, int no_tasks, char * filter_title){
    for (int i = 0; i < no_tasks; i++) {
        if (strstr(array_tasks[i].title, filter_title) != NULL) {
            printTask(&array_tasks[i]);
        }
    }
}
//End Requirement 14//
//Requirement 15//
void printFilteredTasksByDescription(struct Task * array_tasks, int no_tasks, char * filter_description){
    for (int i = 0; i < no_tasks; i++) {
        if (strstr(array_tasks[i].description, filter_description) != NULL) {
            printTask(&array_tasks[i]);
        }
    }
}
//End Requirement 15//
//Requirement 16//
void printFilteredTasksByStatus(struct Task * array_tasks, int no_tasks, enum Status filter_status){
    for (int i = 0; i < no_tasks; i++) {
        if (array_tasks[i].status == filter_status) {
            printTask(&array_tasks[i]);
        }
    }
}
//End Requirement 16//
//Requirement 17//
bool addTask(struct Task * array_tasks, int no_tasks,char * new_title ,char * new_description, char * new_time){
    if((checkTitle(new_title) == -1) && (checkDescription(new_description) == -1) && (checkTime(new_time) == -1)){
        array_tasks[no_tasks].num = no_tasks + 1;
        strcpy(array_tasks[no_tasks].title, new_title);
        strcpy(array_tasks[no_tasks].description, new_description);
        strcpy(array_tasks[no_tasks].time, new_time);
        array_tasks[no_tasks].status = 0;
        return true;
    }
    return false;
}
//End Requirement 17//
//Requirement 18//
bool deleteTask(struct Task * array_tasks, int no_tasks, int num){
    if (num > no_tasks || num < 1) return false;
    while (num <= no_tasks){
        array_tasks[num - 1] = array_tasks[num];
        array_tasks[num - 1].num -= 1;
        ++num;
    }
    return true;
}
//End Requirement 18//
//Requirement 19//
bool checkSupportTime (struct Task * task, int start){
    int hh, mm, dd, mo, yyyy;
    int hh2, mm2, dd2, mo2, yyyy2;
    sscanf(task->time, "%d:%d|%d/%d/%d-%d:%d|%d/%d/%d", &hh, &mm, &dd, &mo, &yyyy, &hh2, &mm2, &dd2, &mo2, &yyyy2);
    int julianday = (1461 * (yyyy + 4800 + (mo - 14) / 12)) / 4 + (367 * (mo - 2 - 12 * ((mo - 14) / 12))) / 12 - (3 * ((yyyy + 4900 + (mo - 14) / 12) / 100)) / 4 + dd - 32075;
    int julianday2 = (1461 * (yyyy2 + 4800 + (mo2 - 14) / 12)) / 4 + (367 * (mo2 - 2 - 12 * ((mo2 - 14) / 12))) / 12 - (3 * ((yyyy2 + 4900 + (mo2 - 14) / 12) / 100)) / 4 + dd2 - 32075;
    if ((julianday >= start && julianday <= start + 6) && (julianday2 >= start && julianday2 <= start + 6)){
        if (mm != 0 || mm2 != 0) return 1;
    }
    return 0;
}
int printWeekTime(struct Task * array_tasks,int no_tasks, char * date){
    char* start = strchr(date, '/');
    char DDD[4] = "";
    strncpy(DDD, date, start - date);
    int dd, mo, yyyy;
    sscanf(start, "/%d/%d/%d", &dd, &mo, &yyyy);
    int julianday = (1461 * (yyyy + 4800 + (mo - 14) / 12)) / 4 + (367 * (mo - 2 - 12 * ((mo - 14) / 12))) / 12 - (3 * ((yyyy + 4900 + (mo - 14) / 12) / 100)) / 4 + dd - 32075;
    for (int i = 0; i < no_tasks; i++){
        if (checkSupportTime(&array_tasks[i], julianday - (julianday%7))){
            printUnsupportedTime(&array_tasks[i]);
            return i;
        };
    }
    return -1;
}
//End Requirement 19//
// ------ End: Student Answer ------ //

int getFieldFromShow(char * show_cmd){
    char* start = strchr(show_cmd, ' ') + 1;
    char* end = strchr(start, ':');
    if (end == NULL) end = strchr(start, '\0');
    char cloneShow[6] = "";
    for (int i = 0; i < end - start; i++){
        if (i > 6) break;
        cloneShow[i] = start[i];
    }
    strupr(cloneShow);
    if (strstr(cloneShow, "#") != NULL){
        return -1;
    } 
    else if (strstr(cloneShow, "ALL") != NULL) {
        return 1;
    } 
    else if (strstr(cloneShow, "HEAD") != NULL) {
        return 2;
    } 
    else if (strstr(cloneShow, "TAIL") != NULL) {
        return 3;
    } 
    else if (strstr(cloneShow, "FILTER") != NULL) {
        return 4;
    } 
    else if (strstr(cloneShow, "WEEK") != NULL){
        return 5;
    }
    else {
        return 0;
    }
}
void runTodoApp(char *command) {
    enum CommandType commandType = getCommandType(command);
    printf("Command     : %s\n", command);
    printf("Command type: %s\n", command_name[commandType]);
    switch (commandType)
    {
    case 0:{
        char raw_title[MAX_LENGTH_TITLE] = "\0";
        char raw_description[MAX_LENGTH_DESCRIPTION] = "\0";
        char raw_time[MAX_LENGTH_TIME] = "\0";

        getTitleFromAdd(command, raw_title);
        getDescriptionFromAdd(command, raw_description);
        getTimeFromAdd(command, raw_time);
        bool addList = addTask(tasklist, no_tasks, raw_title, raw_description,   raw_time);
        printf("Add list?   : %s\n", (addList) ? "Yes because it's valid" : "No because it's invalid");
        no_tasks += (addList) ? 1 : 0;
        break;
    }
    case 1:{
        printf("Edit?       : %s\n",(getNumFromCommand(command) == -1 || getNumFromCommand(command) == 0 || getNumFromCommand(command) > no_tasks) ? "No" : "Yes");
        if (getNumFromCommand(command) == -1 || getNumFromCommand(command) == 0 || getNumFromCommand(command) > no_tasks) break;
        if (getFieldFromEdit(command) == 1){
            char raw_title[MAX_LENGTH_TITLE] = "\0";
            getTitleFromEdit(command, raw_title);
            strcpy(tasklist[getNumFromCommand(command)-1].title, raw_title);
        }
        else if (getFieldFromEdit(command) == 2){
            char raw_description[MAX_LENGTH_DESCRIPTION] = "\0";
            getDescriptionFromEdit(command, raw_description);
            strcpy(tasklist[getNumFromCommand(command)-1].description, raw_description);
        }
        else if (getFieldFromEdit(command) == 3){
            char raw_time[MAX_LENGTH_TIME] = "\0";
            getTimeFromEdit(command, raw_time);
            strcpy(tasklist[getNumFromCommand(command)-1].time, raw_time);
        }
        else if (getFieldFromEdit(command) == 4){
            tasklist[getNumFromCommand(command)-1].status = getStatusFromEdit(command);
        }
        printf("Edited?     : Yes\n");
        break;
    }
    case 2:{
        printf("Starting %s...\n", command);
        switch (getFieldFromShow(command))
        {
        case -1:{
            if (getNumFromCommand(command) == -1) break;
            printTaskByNum(tasklist, no_tasks, getNumFromCommand(command));
            break;
        }
        case 1:{
            printAllTasks(tasklist, no_tasks);
            break;
        }
        case 2:{
            if (getNumFromCommand(command) == -1) break;
            printHeadTasks(tasklist, no_tasks, getNumFromCommand(command));
            break;
        }
        case 3:{
            if (getNumFromCommand(command) == -1) break;
            printTailTasks(tasklist, no_tasks, getNumFromCommand(command));
            break;
        }
        case 4:{
            if (getFieldFromEdit(command) == 1){
                char raw_title[MAX_LENGTH_TITLE] = "\0";
                getTitleFromEdit(command, raw_title);
                printFilteredTasksByTitle(tasklist, no_tasks, raw_title);
            }
            else if (getFieldFromEdit(command) == 2){
                char raw_description[MAX_LENGTH_DESCRIPTION] = "\0";
                getDescriptionFromEdit(command, raw_description);
                printFilteredTasksByDescription(tasklist, no_tasks, raw_description);
            }
            else if (getFieldFromEdit(command) == 4){
                printFilteredTasksByStatus(tasklist,no_tasks,getStatusFromEdit(command));;
            }
            break;
        }
        case 5:{
            char out_time[MAX_LENGTH_TIME];
            char* start = strchr(command, '[') + 1;
            char* end = strchr(start, ']');
            strncpy(out_time, start, end - start);
            for (int i = 0; i < end - start; i++){
                out_time[i] = start[i];
            }
            if(printWeekTime(tasklist, no_tasks, out_time) == -1){
                printf("0 unsupported-time!\n");
            };
            break;
        }
        default:
            break;
        }
        printf("End %s.\n", command);
        break;
    }
    case 3:{
        int num = getNumFromCommand(command);
        no_tasks -= deleteTask(tasklist, no_tasks, num)? 1 : 0;
        break;
    }
    default:
        break;
    }
}

int main() {
    FILE *fp;
    fp = fopen (".\\Testcase.txt", "r");
    char command[MAX_LENGTH_COMMAND+1] = "\0";
    int countLine = 1;
    while (fgets(command, MAX_LENGTH_COMMAND+1, fp) != NULL) {
        printf("--------------------------------------------------\n");
        printf("Command .No : #%d\n", countLine);
        command[strlen(command) - 1] = '\0';
        runTodoApp(command);
        if (getCommandType(command) == 4) break;
        strcpy (command, "");
        ++countLine;
    }
    printf("--------------------------------------------------\n");
    return 0;
}