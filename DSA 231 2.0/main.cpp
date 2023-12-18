#include <chrono>
auto start = std::chrono::high_resolution_clock::now();


#include "main.h"
#include "restaurant.cpp"

int main(int argc, char* argv[]) {
    
    string fileName = "test.txt";
    simulate(fileName);
    auto stop = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::duration<double>>(stop - start);

    std::cout << "Running time: " << (double)duration.count() << " seconds" << std::endl;

	return 0;
}