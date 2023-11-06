#include "main.h"
#include <fstream>
#include <memory>
extern int MAXSIZE;

//*** Use to check memory usage ***//
struct AllocationMetrics{
	uint64_t totalAllocated=0;
	uint64_t totalFreed=0;

	uint64_t currentUsage(){return totalAllocated-totalFreed;}
};

static AllocationMetrics s_AllocationMetrics;

void* operator new(size_t size){
	s_AllocationMetrics.totalAllocated +=size;
	return malloc(size);
}

void operator delete(void *memory,size_t size){
	s_AllocationMetrics.totalFreed +=size;
	free(memory);
}

static void printMemoryUsage(){
	cout<<"Memory Usage: "<<s_AllocationMetrics.currentUsage()<<" bytes\n";
}
//*** Use to check memory usage ***//

//*** Main class ***//
class imp_res : public Restaurant
{   
    //Create a new class to store the time customers arrive at the restaurant
    public:
    class customerTime {
        public:
        customer* data;
        customerTime* next;
        customerTime* prev;
        public:
        customerTime(customer* data, customerTime* next = nullptr, customerTime* prev = nullptr) :data(data), next(next), prev(prev) {};
        ~customerTime() {
        };
    };
    public:
    int inDeskCount = 0; //!Count customers in desk
    customer* customerX = nullptr; //!X position
    customer* customerPtr = nullptr; //!Flexible

    int inQueueCount = 0; //!Count customers in queue
    customer* customerInQueueHead = nullptr; //!First customer enter queue
    customer* customerQueuePtr = nullptr; //!Flexible
    customer* customerInQueueTail = nullptr;

    customerTime* customerTimeHead = nullptr; //!First customer enter desk
    customerTime* customerTimePtr = nullptr; //!Flexible
    customerTime* customerTimeTail = nullptr; //!Last customer enter desk	
    public:
    imp_res() {};
    ~imp_res(){
        //Create destructor to release memory
        int timeLength = this->inDeskCount + this->inQueueCount;
        customerTimePtr = customerTimeHead;
        while(customerTimePtr) {
            customerTime* tempDomain = customerTimePtr;
            customerTimePtr = customerTimePtr->next;
            if (inQueue(tempDomain->data)) {
                deleteCustomerTimeQueue(tempDomain);
            }
            else if (inDesk(tempDomain->data)) {
                customerX = (tempDomain->data->energy >= 0) ? tempDomain->data->next : tempDomain->data->prev;
                deleteCustomerTimeDesk(tempDomain);
            }
        }
    }

    bool inDesk(customer* check) { //Used to check if the customer is at the desk or not
        customer* customerPtr = customerX;
        for (int i = 0; i < this->inDeskCount; ++i) {
            if (check == customerPtr) return 1;
            customerPtr = customerPtr->next;
        }
        return 0;
    }
    bool inQueue(customer* check) { //Used to check if the customer is queueing or not
        customer* customerQueuePtr = customerInQueueHead;
        for (int i = 0; i < this->inQueueCount; ++i) {
            if (check == customerQueuePtr) return 1;
            customerQueuePtr = customerQueuePtr->next;
        }
        return 0;
    }
    bool compareTime(customer* a, customer* b) { //Returns true if customer a arrives at the restaurant earlier than customer b
        customerTime* tempCompare = customerTimeHead;
        for (int i = 0; i < this->inDeskCount + this->inQueueCount; ++i) {
            if (tempCompare->data == a) {
                tempCompare = nullptr;
                return 1;}
            else if (tempCompare->data == b) {
                tempCompare = nullptr;
                return 0;
            }
            tempCompare = tempCompare->next;
        }
    }
    void deleteCustomerDesk(customer* ctm) { //Used to release memory when a customer (inDesk) leaves the restaurant
        if (this->inDeskCount == 1){
            customerX = nullptr;
            customerPtr = nullptr;
        }
        if (customerPtr == ctm) customerPtr = nullptr;
        if (customerX == ctm) customerX = nullptr;
        ctm->next->prev = ctm->prev;
        ctm->prev->next = ctm->next;
        ctm->next = nullptr;
        ctm->prev = nullptr;
        delete ctm;
        --this->inDeskCount;
    }
    void deleteCustomerTimeDesk(customerTime* cT) { //Used to release memory when a customer (inDesk) leaves the restaurant
        if (customerTimePtr == cT) customerTimePtr = nullptr;
        if (cT == customerTimeHead && cT == customerTimeTail) {
            customerTimeHead = nullptr;
            customerTimeTail = nullptr;
        }
        else if (cT == customerTimeHead) {
            customerTimeHead = customerTimeHead->next;
            customerTimeHead->prev = nullptr;
        }
        else if (cT == customerTimeTail) {
            customerTimeTail = customerTimeTail->prev;
            customerTimeTail->next = nullptr;
        }
        else {
            cT->next->prev = cT->prev;
            cT->prev->next = cT->next;
        }
        cT->next = nullptr;
        cT->prev = nullptr;
        customer* tempTD = cT->data;
        cT->data = nullptr;
        deleteCustomerDesk(tempTD);
        delete cT;
    }
    void deleteCustomerQueue(customer* ctm) { //Used to release memory when a customer (inQueue) leaves the restaurant
        if (customerQueuePtr == ctm) customerQueuePtr = nullptr;
        if (ctm == customerInQueueHead && ctm == customerInQueueTail) {
            customerInQueueHead = nullptr;
            customerInQueueTail = nullptr;
        }
        else if (ctm == customerInQueueHead) {
            customerInQueueHead = customerInQueueHead->next;
            customerInQueueHead->prev = nullptr;
        }
        else if (ctm == customerInQueueTail) {
            customerInQueueTail = customerInQueueTail->prev;
            customerInQueueTail->next = nullptr;
        }
        else {
            ctm->next->prev = ctm->prev;
            ctm->prev->next = ctm->next;
        }
        ctm->next = nullptr;
        ctm->prev = nullptr;
        delete ctm;
        --this->inQueueCount;
    }
    void deleteCustomerTimeQueue(customerTime* cT) { //Used to release memory when a customer (inQueue) leaves the restaurant
        if (customerTimePtr == cT) customerTimePtr = nullptr;
        if (cT == customerTimeHead && cT == customerTimeTail) {
            customerTimeHead = nullptr;
            customerTimeTail = nullptr;
        }
        else if (cT == customerTimeHead) {
            customerTimeHead = customerTimeHead->next;
            customerTimeHead->prev = nullptr;
        }
        else if (cT == customerTimeTail) {
            customerTimeTail = customerTimeTail->prev;
            customerTimeTail->next = nullptr;
        }
        else {
            cT->next->prev = cT->prev;
            cT->prev->next = cT->next;
        }
        cT->next = nullptr;
        cT->prev = nullptr;
        customer* tempTQ = cT->data;
        cT->data = nullptr;
        deleteCustomerQueue(tempTQ);
        delete cT;
    }
    customer* findCustomerAt(int value) { //Used to search for customer in the queue list
        if (value < 0) return nullptr;
        if (value > this->inQueueCount + 1) return nullptr;
        customerQueuePtr = customerInQueueHead;
        for (int ind = 0; ind < value; ind++) {
            customerQueuePtr = customerQueuePtr->next;
        }
        return customerQueuePtr;
    }
    int inssort2(int plus, int n, int incr, int changeTime) { //Used to shellsort customers in queue
        for (int i = incr; i < n; i += incr) {
            for (int j = i; (j >= incr) && (abs(findCustomerAt(j - incr + plus)->energy) <= abs(findCustomerAt(j + plus)->energy)); j -= incr) {
                customer* cusA = findCustomerAt(j + plus);
                customer* cusB = findCustomerAt(j - incr + plus);

                if ((abs(cusB->energy) == abs(cusA->energy)) && compareTime(cusB, cusA)) continue;
                //Swap customer A and customer B in queue
                customer* tempNext = cusA->next;
                customer* tempPrev = cusA->prev;

                cusA->prev = cusB->prev;
                if (cusB->next == cusA) cusA->next = cusB;
                else cusA->next = cusB->next;

                cusB->next = tempNext;
                if (tempPrev == cusB) cusB->prev = cusA;
                else cusB->prev = tempPrev;

                if (cusA->prev != nullptr) cusA->prev->next = cusA;
                cusA->next->prev = cusA;

                if (cusB->next != nullptr) cusB->next->prev = cusB;
                cusB->prev->next = cusB;

                if (cusB == customerInQueueHead) customerInQueueHead = cusA;
                if (cusA == customerInQueueTail) customerInQueueTail = cusB;
                //Swap customer A and customer B in queue
                ++changeTime;
            }
        }
        return changeTime;
    }
    int shellsort(int n) { //Used to shellsort customers in queue
        int changeTime = 0; //!Count swap time using shellsort
        for (int i = n / 2; i > 2; i /= 2) {
            for (int j = 0; j < i; j++) {
                changeTime = inssort2(j, n - j, i, changeTime);
            }
        }
        changeTime = inssort2(0, n, 1, changeTime);
        return changeTime;
    }

    void RED(string name, int energy)
    {
        //Refuse customer has energy = 0
        if (energy == 0) return;

        //Refuse customer has same name with another in desk/queue
        if (this->inDeskCount > 0) {
            customerPtr = customerX;
            for (int i = 0; i < this->inDeskCount; ++i) {
                if (name == customerPtr->name) return;
                else customerPtr = customerPtr->next;
            }
        }
        if (this->inQueueCount > 0) {
            customerQueuePtr = customerInQueueHead;
            for (int i = 0; i < this->inQueueCount; ++i) {
                if (name == customerQueuePtr->name) return;
                else customerQueuePtr = customerQueuePtr->next;
            }
        }

        //If Desk and Queue full -> refuse
        if (this->inQueueCount + this->inDeskCount == MAXSIZE * 2) return;

        //Create new customer
        customer* newCustomer = new customer(name, energy, nullptr, nullptr);
        if (inDeskCount == 0) {	//constructor if there is no customer in Desk
            this->customerX = newCustomer;
            ++this->inDeskCount;
            this->customerX->next = customerX;
            this->customerX->prev = customerX;

            customerTime* newCustomerTime = new customerTime(newCustomer, nullptr, nullptr);
            customerTimeHead = newCustomerTime;
            customerTimeTail = newCustomerTime;
        } //Prepare seat for customer who enters when inDeskCount < MAXSIZE/2
        else if (this->inDeskCount > 0 && this->inDeskCount < MAXSIZE / 2) {
            if (energy >= this->customerX->energy) {
                newCustomer->next = this->customerX->next;
                newCustomer->next->prev = newCustomer;
                this->customerX->next = newCustomer;
                newCustomer->prev = this->customerX;
                this->customerX = newCustomer;
                ++this->inDeskCount;
            }
            else {
                newCustomer->prev = this->customerX->prev;
                newCustomer->prev->next = newCustomer;
                this->customerX->prev = newCustomer;
                newCustomer->next = this->customerX;
                this->customerX = newCustomer;
                ++this->inDeskCount;
            }

            customerTime* newCustomerTime = new customerTime(newCustomer, nullptr, nullptr);
            customerTimeTail->next = newCustomerTime;
            newCustomerTime->prev = customerTimeTail;
            customerTimeTail = newCustomerTime;
        } //Prepare seat for customer who enters when inDeskCount > MAXSIZE/2 and < MAXSIZE
        else if (this->inDeskCount >= MAXSIZE / 2 && this->inDeskCount < MAXSIZE) {
            customerPtr = customerX;
            int MAXRES = energy - customerX->energy;
            for (int j = 0; j < this->inDeskCount; j++) {
                if (abs(energy - customerPtr->energy) > abs(MAXRES)) {
                    MAXRES = energy - customerPtr->energy;
                    customerX = customerPtr;
                }
                customerPtr = customerPtr->next;
            }
            if (MAXRES >= 0) {
                newCustomer->next = this->customerX->next;
                newCustomer->next->prev = newCustomer;
                this->customerX->next = newCustomer;
                newCustomer->prev = this->customerX;
                this->customerX = newCustomer;
                ++this->inDeskCount;
            }
            else {
                newCustomer->prev = this->customerX->prev;
                newCustomer->prev->next = newCustomer;
                this->customerX->prev = newCustomer;
                newCustomer->next = this->customerX;
                this->customerX = newCustomer;
                ++this->inDeskCount;
            }

            customerTime* newCustomerTime = new customerTime(newCustomer, nullptr);
            customerTimeTail->next = newCustomerTime;
            newCustomerTime->prev = customerTimeTail;
            customerTimeTail = newCustomerTime;
        } //Prepare for customer who enters when desk is full -> queue
        else if (this->inDeskCount == MAXSIZE && this->inQueueCount == 0) {
            this->customerInQueueHead = newCustomer;
            this->customerInQueueTail = newCustomer;

            customerTime* newCustomerTime = new customerTime(newCustomer, nullptr, nullptr);
            customerTimeTail->next = newCustomerTime;
            newCustomerTime->prev = customerTimeTail;
            customerTimeTail = newCustomerTime;

            ++this->inQueueCount;
        } //Prepare for customer who enters when desk is full -> queue
        else if (this->inDeskCount == MAXSIZE && this->inQueueCount < MAXSIZE) {
            this->customerInQueueTail->next = newCustomer;
            newCustomer->prev = customerInQueueTail;
            this->customerInQueueTail = newCustomer;

            customerTime* newCustomerTime = new customerTime(newCustomer, nullptr, nullptr);
            customerTimeTail->next = newCustomerTime;
            newCustomerTime->prev = customerTimeTail;
            customerTimeTail = newCustomerTime;

            ++this->inQueueCount;
        }
    }
    void BLUE(int num)
    {
        if (num <= 0) return; //If num <= then return
        if (inDeskCount == 0) return; //If none in desk to delete then return
        customerTimePtr = customerTimeHead;
        int deleteLoop = this->inQueueCount + this->inDeskCount;
        //Use function inDesk() and deleteCustomerTimeDesk() to delete customer(s) in desk
        for (int i = 0; i < deleteLoop; ++i) {
            if (this->inDeskCount == 0 or num == 0) break;
            customerTime* tempTime = customerTimePtr;
            customerTimePtr = customerTimePtr->next;
            if (inDesk(tempTime->data)) {
                customerX = (tempTime->data->energy >= 0) ? tempTime->data->next : tempTime->data->prev;
                deleteCustomerTimeDesk(tempTime);
                --num;
            }
        }
        //If there are customers in the queue then add them to the desk
        if (inQueueCount > 0) {
            int addCount = MAXSIZE - this->inDeskCount;
            for (int j = 0; j < addCount; j++) {
                if (this->inQueueCount == 0) break;
                customerQueuePtr = customerInQueueHead;
                customerInQueueHead = customerInQueueHead->next;
                if (customerQueuePtr == customerInQueueTail) customerInQueueTail = nullptr;
                else customerInQueueHead->prev = nullptr;
                if (inDeskCount == 0) {	

                    this->customerX = customerQueuePtr;
                    this->customerX->next = customerX;
                    this->customerX->prev = customerX;

                }
                else if (this->inDeskCount > 0 && this->inDeskCount < MAXSIZE / 2) {

                    if (customerQueuePtr->energy >= this->customerX->energy) {
                        customerQueuePtr->next = this->customerX->next;
                        customerQueuePtr->next->prev = customerQueuePtr;
                        this->customerX->next = customerQueuePtr;
                        customerQueuePtr->prev = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                    else {
                        customerQueuePtr->prev = this->customerX->prev;
                        customerQueuePtr->prev->next = customerQueuePtr;
                        this->customerX->prev = customerQueuePtr;
                        customerQueuePtr->next = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                }
                else if (this->inDeskCount >= MAXSIZE / 2 && this->inDeskCount < MAXSIZE) {

                    customerPtr = customerX;
                    int MAXRES = customerQueuePtr->energy - customerX->energy;
                    for (int j = 0; j < this->inDeskCount; j++) {
                        if (abs(customerQueuePtr->energy - customerPtr->energy) > abs(MAXRES)) {
                            MAXRES = customerQueuePtr->energy - customerPtr->energy;
                            customerX = customerPtr;
                        }
                        customerPtr = customerPtr->next;
                    }
                    if (MAXRES >= 0) {
                        customerQueuePtr->next = this->customerX->next;
                        customerQueuePtr->next->prev = customerQueuePtr;
                        this->customerX->next = customerQueuePtr;
                        customerQueuePtr->prev = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                    else {
                        customerQueuePtr->prev = this->customerX->prev;
                        customerQueuePtr->prev->next = customerQueuePtr;
                        this->customerX->prev = customerQueuePtr;
                        customerQueuePtr->next = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                }
                ++this->inDeskCount;
                --this->inQueueCount;
            }
        }
    }
    void PURPLE()
    {
        if (this->inQueueCount < 2) return; //Return if there are not enough customers in queue to sort
        int distanceFromMax = 0, maxEnergy = 0;
        customer* tempQueue = nullptr;
        customerQueuePtr = customerInQueueHead;
        for (int i = 1; i <= this->inQueueCount; ++i) { //Find customer whose abs(energy) is biggest in queue
            if (abs(customerQueuePtr->energy) > maxEnergy or (abs(customerQueuePtr->energy) == maxEnergy && compareTime(tempQueue, customerQueuePtr))) {
                maxEnergy = abs(customerQueuePtr->energy);
                distanceFromMax = i;
                tempQueue = customerQueuePtr;
            }
            customerQueuePtr = customerQueuePtr->next;
        }
        tempQueue = nullptr;
        int changeTime = shellsort(distanceFromMax);
        BLUE(changeTime % MAXSIZE);
    }
    void REVERSAL()
    {
        if (inDeskCount == 0) return; //Return if there is no customer in desk to reverse
        int negativeEnergyCount = 0; //!Count number customers who have negative energy in desk
        int positiveEnergyCount = 0; //!Count number customers who have positive energy in desk
        customerPtr = customerX;
        for (int i = 0; i < this->inDeskCount; ++i) {
            (customerPtr->energy > 0) ? positiveEnergyCount++ : negativeEnergyCount++;
            customerPtr = customerPtr->next;
        }

        if (customerX->energy > 0) {
            if (negativeEnergyCount > 1) {
                customer* customerCounterClockwise = customerX->prev;
                customer* customerClockwise = customerX->next;
                int negativeLoop = negativeEnergyCount / 2;
                while (negativeLoop != 0) {
                    if (customerCounterClockwise->energy > 0) {
                        customerCounterClockwise = customerCounterClockwise->prev;
                        continue;
                    }
                    if (customerClockwise->energy > 0) {
                        customerClockwise = customerClockwise->next;
                        continue;
                    }

                    customerClockwise->prev->next = customerCounterClockwise;
                    customerCounterClockwise->prev->next = customerClockwise;
                    customer* tempNext = customerClockwise->next;
                    customerClockwise->next = customerCounterClockwise->next;
                    customerCounterClockwise->next = tempNext;
                    customer* tempPrev = customerClockwise->prev;
                    customerClockwise->prev = customerCounterClockwise->prev;
                    customerCounterClockwise->prev = tempPrev;
                    customerClockwise->next->prev = customerClockwise;
                    customerCounterClockwise->next->prev = customerCounterClockwise;

                    customerPtr = customerCounterClockwise;
                    customerCounterClockwise = customerClockwise->prev;
                    customerClockwise = customerPtr->next;
                    --negativeLoop;
                }
            }

            if (positiveEnergyCount > 1) {
                customer* customerCounterClockwise = customerX;
                customer* customerClockwise = customerX->next;
                int positiveLoop = positiveEnergyCount / 2;
                while (positiveLoop != 0) {
                    if (customerCounterClockwise->energy < 0) {
                        customerCounterClockwise = customerCounterClockwise->prev;
                        continue;
                    }
                    if (customerClockwise->energy < 0) {
                        customerClockwise = customerClockwise->next;
                        continue;
                    }

                    customerClockwise->prev->next = customerCounterClockwise;
                    customerCounterClockwise->prev->next = customerClockwise;
                    customer* tempNext = customerClockwise->next;
                    customerClockwise->next = customerCounterClockwise->next;
                    customerCounterClockwise->next = tempNext;
                    customer* tempPrev = customerClockwise->prev;
                    customerClockwise->prev = customerCounterClockwise->prev;
                    customerCounterClockwise->prev = tempPrev;
                    customerClockwise->next->prev = customerClockwise;
                    customerCounterClockwise->next->prev = customerCounterClockwise;

                    customerPtr = customerCounterClockwise;
                    customerCounterClockwise = customerClockwise->prev;
                    customerClockwise = customerPtr->next;
                    --positiveLoop;
                }
            }
        }
        else if (customerX->energy < 0) {
            if (positiveEnergyCount > 1) {
                customer* customerCounterClockwise = customerX->prev;
                customer* customerClockwise = customerX->next;
                int positiveLoop = positiveEnergyCount / 2;
                while (positiveLoop != 0) {
                    if (customerCounterClockwise->energy < 0) {
                        customerCounterClockwise = customerCounterClockwise->prev;
                        continue;
                    }
                    if (customerClockwise->energy < 0) {
                        customerClockwise = customerClockwise->next;
                        continue;
                    }

                    customerClockwise->prev->next = customerCounterClockwise;
                    customerCounterClockwise->prev->next = customerClockwise;
                    customer* tempNext = customerClockwise->next;
                    customerClockwise->next = customerCounterClockwise->next;
                    customerCounterClockwise->next = tempNext;
                    customer* tempPrev = customerClockwise->prev;
                    customerClockwise->prev = customerCounterClockwise->prev;
                    customerCounterClockwise->prev = tempPrev;
                    customerClockwise->next->prev = customerClockwise;
                    customerCounterClockwise->next->prev = customerCounterClockwise;

                    customerPtr = customerCounterClockwise;
                    customerCounterClockwise = customerClockwise->prev;
                    customerClockwise = customerPtr->next;
                    --positiveLoop;
                }
            }

            if (negativeEnergyCount > 1) {
                customer* customerCounterClockwise = customerX;
                customer* customerClockwise = customerX->next;
                int negativeLoop = negativeEnergyCount / 2;
                while (negativeLoop != 0) {
                    if (customerCounterClockwise->energy > 0) {
                        customerCounterClockwise = customerCounterClockwise->prev;
                        continue;
                    }
                    if (customerClockwise->energy > 0) {
                        customerClockwise = customerClockwise->next;
                        continue;
                    }

                    customerClockwise->prev->next = customerCounterClockwise;
                    customerCounterClockwise->prev->next = customerClockwise;
                    customer* tempNext = customerClockwise->next;
                    customerClockwise->next = customerCounterClockwise->next;
                    customerCounterClockwise->next = tempNext;
                    customer* tempPrev = customerClockwise->prev;
                    customerClockwise->prev = customerCounterClockwise->prev;
                    customerCounterClockwise->prev = tempPrev;
                    customerClockwise->next->prev = customerClockwise;
                    customerCounterClockwise->next->prev = customerCounterClockwise;

                    customerPtr = customerCounterClockwise;
                    customerCounterClockwise = customerClockwise->prev;
                    customerClockwise = customerPtr->next;
                    --negativeLoop;
                }
            }
        }
    }
    void UNLIMITED_VOID()
    {
        if (this->inDeskCount < 4) return;
        int minimumSum = 0;
        int maximumCount = this->inDeskCount;
        customerPtr = customerX;
        for (int i = 0; i < this->inDeskCount; ++i) {
            minimumSum += customerPtr->energy;
            customerPtr = customerPtr->next;
        }

        customer* customerMiniHead = customerX;

        for (int i = 0; i < this->inDeskCount; ++i) {
            int sum = 0;
            customer* tempVoid = customerPtr;
            for (int j = 0; j < this->inDeskCount; j++) {
                sum += tempVoid->energy;
                if (j < 3) {
                    tempVoid = tempVoid->next;
                    continue;
                }
                if (sum < minimumSum) {
                    customerMiniHead = customerPtr;
                    minimumSum = sum;
                    maximumCount = j + 1;
                }
                else if (sum == minimumSum) {
                    if (j + 1 >= maximumCount) {
                        customerMiniHead = customerPtr;
                        minimumSum = sum;
                        maximumCount = j + 1;
                    }
                }
                tempVoid = tempVoid->next;
            }
            customerPtr = customerPtr->next;
        }
        int distanceFromHtoM = 0;
        customer* customerMin = customerMiniHead;
        customerPtr = customerMiniHead;
        for (int i = 0; i < maximumCount; ++i) {
            if (customerPtr->energy < customerMin->energy) {
                customerMin = customerPtr;
                distanceFromHtoM = i;
            }
            customerPtr = customerPtr->next;
        }
        for (int i = 0; i < maximumCount - distanceFromHtoM; ++i) {
            customerMin->print();
            customerMin = customerMin->next;
        }
        for (int i = 0; i < distanceFromHtoM; ++i) {
            customerMiniHead->print();
            customerMiniHead = customerMiniHead->next;
        }
    }
    void DOMAIN_EXPANSION()
    {
        int energy3 = 0; //!Sum positive energy 
        int energy4 = 0; //!Sum negative energy
        if (this->inDeskCount > 0) {
            customerPtr = customerX;
            for (int i = 0; i < this->inDeskCount; ++i) {
                energy3 += (customerPtr->energy >= 0) ? customerPtr->energy : 0;
                energy4 += (customerPtr->energy < 0) ? customerPtr->energy : 0;
                customerPtr = customerPtr->next;
            }
        }
        else return;

        if (this->inQueueCount > 0) {
            customerQueuePtr = customerInQueueHead;
            for (int i = 0; i < this->inQueueCount; ++i) {
                energy3 += (customerQueuePtr->energy >= 0) ? customerQueuePtr->energy : 0;
                energy4 += (customerQueuePtr->energy < 0) ? customerQueuePtr->energy : 0;
                customerQueuePtr = customerQueuePtr->next;
            }
        }

        if (energy3 >= abs(energy4)) {
            int timeLength = this->inDeskCount + this->inQueueCount;
            customerTimePtr = customerTimeTail;
            for (int i = 0; i < timeLength; ++i) {
                customerTime* tempDomain = customerTimePtr;
                customerTimePtr = customerTimePtr->prev;
                if (tempDomain->data->energy < 0) {
                    tempDomain->data->print();
                }
            }
            customerTimePtr = customerTimeHead;
            for (int i = 0; i < timeLength; ++i) {
                customerTime* tempDomain = customerTimePtr;
                customerTimePtr = customerTimePtr->next;
                if (tempDomain->data->energy < 0 && inQueue(tempDomain->data)) {
                    deleteCustomerTimeQueue(tempDomain);
                }
                else if (tempDomain->data->energy < 0 && inDesk(tempDomain->data)) {
                    customerX = (tempDomain->data->energy >= 0) ? tempDomain->data->next : tempDomain->data->prev;
                    deleteCustomerTimeDesk(tempDomain);
                }
            }
        }
        else {
            int timeLength = this->inDeskCount + this->inQueueCount;
            customerTimePtr = customerTimeTail;
            for (int i = 0; i < timeLength; ++i) {
                customerTime* tempDomain = customerTimePtr;
                customerTimePtr = customerTimePtr->prev;
                if (tempDomain->data->energy >= 0) {
                    tempDomain->data->print();
                }
            }
            customerTimePtr = customerTimeHead;
            for (int i = 0; i < timeLength; ++i) {
                customerTime* tempDomain = customerTimePtr;
                customerTimePtr = customerTimePtr->next;
                if (tempDomain->data->energy >= 0 && inQueue(tempDomain->data)) {
                    deleteCustomerTimeQueue(tempDomain);
                }
                else if (tempDomain->data->energy >= 0 && inDesk(tempDomain->data)) {
                    customerX = (tempDomain->data->energy >= 0) ? tempDomain->data->next : tempDomain->data->prev;
                    deleteCustomerTimeDesk(tempDomain);
                }
            }
        }

        //If there are customers in the queue then add them to the desk
        if (inQueueCount > 0) {
            int addCount = MAXSIZE - this->inDeskCount;
            for (int j = 0; j < addCount; j++) {
                if (this->inQueueCount == 0) break;
                customerQueuePtr = customerInQueueHead;
                customerInQueueHead = customerInQueueHead->next;
                if (customerQueuePtr == customerInQueueTail) customerInQueueTail = nullptr;
                else customerInQueueHead->prev = nullptr;
                if (inDeskCount == 0) {	

                    this->customerX = customerQueuePtr;
                    this->customerX->next = customerX;
                    this->customerX->prev = customerX;

                }
                else if (this->inDeskCount > 0 && this->inDeskCount < MAXSIZE / 2) {

                    if (customerQueuePtr->energy >= this->customerX->energy) {
                        customerQueuePtr->next = this->customerX->next;
                        customerQueuePtr->next->prev = customerQueuePtr;
                        this->customerX->next = customerQueuePtr;
                        customerQueuePtr->prev = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                    else {
                        customerQueuePtr->prev = this->customerX->prev;
                        customerQueuePtr->prev->next = customerQueuePtr;
                        this->customerX->prev = customerQueuePtr;
                        customerQueuePtr->next = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                }
                else if (this->inDeskCount >= MAXSIZE / 2 && this->inDeskCount < MAXSIZE) {

                    customerPtr = customerX;
                    int MAXRES = customerQueuePtr->energy - customerX->energy;
                    for (int j = 0; j < this->inDeskCount; j++) {
                        if (abs(customerQueuePtr->energy - customerPtr->energy) > abs(MAXRES)) {
                            MAXRES = customerQueuePtr->energy - customerPtr->energy;
                            customerX = customerPtr;
                        }
                        customerPtr = customerPtr->next;
                    }
                    if (MAXRES >= 0) {
                        customerQueuePtr->next = this->customerX->next;
                        customerQueuePtr->next->prev = customerQueuePtr;
                        this->customerX->next = customerQueuePtr;
                        customerQueuePtr->prev = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                    else {
                        customerQueuePtr->prev = this->customerX->prev;
                        customerQueuePtr->prev->next = customerQueuePtr;
                        this->customerX->prev = customerQueuePtr;
                        customerQueuePtr->next = this->customerX;
                        this->customerX = customerQueuePtr;
                    }
                }
                ++this->inDeskCount;
                --this->inQueueCount;
            }
        }
    }
    void LIGHT(int num)
    {
        if (num > 0) {
            //Print customers who is in desk
            if (this->inDeskCount > 0) {
                customerPtr = customerX;
                for (int i = 0; i < this->inDeskCount; ++i) {
                    customerPtr->print();
                    customerPtr = customerPtr->next;
                }
            }
        }
        else if (num < 0) {
            //Print customers who is in desk
            if (this->inDeskCount > 0) {
                customerPtr = customerX;
                for (int i = 0; i < this->inDeskCount; ++i) {
                    customerPtr->print();
                    customerPtr = customerPtr->prev;
                }
            }
        }
        else {
            //Print customers who is in queue
            if (this->inQueueCount > 0) {
                customerQueuePtr = customerInQueueHead;
                for (int i = 0; i < this->inQueueCount; ++i) {
                    customerQueuePtr->print();
                    customerQueuePtr = customerQueuePtr->next;
                }
            }
        }
    }
};