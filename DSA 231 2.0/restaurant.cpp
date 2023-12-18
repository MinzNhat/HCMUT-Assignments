#include "main.h"
int MAXSIZE = 0;

class huffNode
{
private:
	char data;
	int freq;
	bool isAlpha;
	string code;

	huffNode *left = nullptr;
	huffNode *right = nullptr;
	friend class huffTree;

public:
	huffNode(char data, int freq) : data(data), freq(freq){};
	huffNode(huffNode *left, huffNode *right) : data('\0'), left(left), right(right){};
	huffNode(huffNode *copyNode) : data(copyNode->data), freq(copyNode->freq), isAlpha(copyNode->isAlpha), left(copyNode->left), right(copyNode->right)
	{
		delete copyNode;
	};
	~huffNode(){};
};

class huffTree
{
private:
	huffNode *root;

public:
	huffTree() : root(nullptr){};
	huffTree(vector<pair<char, pair<int, int>>> &list)
	{
		auto cmp = [](const pair<int, huffNode *> a, const pair<int, huffNode *> b)
		{
			if (a.second->freq == b.second->freq)
			{
				if (a.second->isAlpha && b.second->isAlpha)
				{
					if (islower(a.second->data) && islower(b.second->data))
						return a.second->data > b.second->data;
					else if (isupper(a.second->data) && isupper(b.second->data))
						return a.second->data > b.second->data;
					else if (islower(a.second->data) && isupper(b.second->data))
						return false;
					else if (islower(b.second->data) && isupper(a.second->data))
						return true;
				}
				else if (a.second->isAlpha && !b.second->isAlpha)
					return false;
				else if (!a.second->isAlpha && b.second->isAlpha)
					return true;
				else
					return a.first > b.first;
			}
			return a.second->freq > b.second->freq;
		};
		priority_queue<pair<int, huffNode *>, vector<pair<int, huffNode *>>, decltype(cmp)> minHeap(cmp);

		for (auto x : list)
		{
			huffNode *temp = new huffNode(x.first, x.second.first);
			temp->isAlpha = true;
			minHeap.push({x.second.first, temp});
		}

		int count = 0;

		while (minHeap.size() != 1)
		{
			pair<int, huffNode *> left = minHeap.top();
			minHeap.pop();

			pair<int, huffNode *> right = minHeap.top();
			minHeap.pop();

			huffNode *temp = new huffNode(left.second, right.second);

			temp->freq = left.second->freq + right.second->freq;
			temp->isAlpha = false;

			int countRotate = 0;

			balanceSubTree(temp, countRotate);

			temp = new huffNode(temp);

			count++;
			minHeap.push({count, temp});
		}

		root = minHeap.top().second;

		while (!minHeap.empty())
		{
			minHeap.pop();
		}
	};
	~huffTree()
	{
		deleteTree(root);
	};

	void printNSpace(int n)
	{
		for (int i = 0; i < n - 1; i++)
		cout << " ";
	}

	void printTreeStructure()
	{
		int height = this->getHeightRecur(root);
		if (this->root == NULL)
		{
			cout << "NULL\n";
			return;
		}
		queue<huffNode *> q;
		q.push(root);
		huffNode *temp;
		int count = 0;
		int maxNode = 1;
		int level = 0;
		int space = pow(2, height);
		printNSpace(space / 2);
		while (!q.empty())
		{
			temp = q.front();
			q.pop();
			if (temp == NULL)
			{
				cout << " ";
				q.push(NULL);
				q.push(NULL);
			}
			else
			{
				if (temp->data == '\0' ) cout << "$";
				else cout << temp->data;
				q.push(temp->left);
				q.push(temp->right);
			}
			printNSpace(space);
			count++;
			if (count == maxNode)
			{
				cout << endl;
				count = 0;
				maxNode *= 2;
				level++;
				space /= 2;
				printNSpace(space / 2);
			}
			if (level == height)
			{
				while (!q.empty())
					q.pop();
				return;
			}
		}
	}

	void deleteTree(huffNode *node)
	{
		if (node == nullptr)
			return;

		deleteTree(node->left);
		deleteTree(node->right);
		delete node;
	};

	void printHuffTreeNode(huffNode *node)
	{
		if (node == nullptr)
			return;

		printHuffTreeNode(node->left);

		if (node->isAlpha)
			cout << node->data << endl;
		else
			cout << node->freq << endl;

		printHuffTreeNode(node->right);
	}

	void printHuffTree()
	{
		printHuffTreeNode(root);
	};

	huffNode *rotateLeft(huffNode *node)
	{
		huffNode *temp = node->right;

		node->right = temp->left;
		temp->left = node;
		return temp;
	};

	huffNode *rotateRight(huffNode *node)
	{
		huffNode *temp = node->left;

		node->left = temp->right;
		temp->right = node;
		return temp;
	};

	bool isFullyNode(huffNode *root)
	{
		if (root == nullptr)
			return true;
		if (root->left == nullptr && root->right == nullptr)
			return true;
		if ((root->left) && (root->right))
			return (isFullyNode(root->left) && isFullyNode(root->right));
		return false;
	};

	void balanceSubTree(huffNode *&subroot, int &countRotate)
	{
		if (subroot == nullptr || countRotate == 3)
		{
			return;
		}

		int balance = getHeightRecur(subroot->right) - getHeightRecur(subroot->left);

		if (balance > 1)
		{
			while (balance > 1 && countRotate != 3)
			{
				int rightBalance = getHeightRecur(subroot->right->right) - getHeightRecur(subroot->right->left);

				if (rightBalance <= -1)
				{
					subroot->right = rotateRight(subroot->right);
					subroot = rotateLeft(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
				}
				else if (rightBalance >= 1)
				{
					subroot = rotateLeft(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
				}
				else
				{
					subroot = rotateLeft(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
					break;
				}
				balance = getHeightRecur(subroot->right) - getHeightRecur(subroot->left);
			}
		}
		else if (balance < -1)
		{
			while (balance < -1 && countRotate != 3)
			{
				int leftBalance = getHeightRecur(subroot->left->right) - getHeightRecur(subroot->left->left);
				if (leftBalance >= 1)
				{
					subroot->left = rotateLeft(subroot->left);
					subroot = rotateRight(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
				}
				else if (leftBalance <= -1)
				{
					subroot = rotateRight(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
				}
				else
				{
					subroot = rotateRight(subroot);
					countRotate++;
					// cout << "count rotate: " << countRotate << endl;
					balanceSubTree(subroot, countRotate);
					break;
				}
				balance = getHeightRecur(subroot->right) - getHeightRecur(subroot->left);
			}
		}
		balanceSubTree(subroot->left, countRotate);
		balanceSubTree(subroot->right, countRotate);
	};

	int getHeightRecur(huffNode *node)
	{
		if (node == nullptr)
			return 0;
		return 1 + max(getHeightRecur(node->left), getHeightRecur(node->right));
	};

	huffNode *getRoot()
	{
		return root;
	};

	void setCode(huffNode *node, string codesave, unordered_map<char, string> &namecode)
	{
		if (node == nullptr)
			return;

		node->code = codesave;

		if (node->isAlpha)
		{
			namecode[node->data] = codesave;
			return;
		}
		setCode(node->left, codesave + "0", namecode);
		setCode(node->right, codesave + "1", namecode);
	}
};

class treeBST
{
private:
	class Node
	{
	private:
		int result;
		Node *left;
		Node *right;
		friend class treeBST;

	public:
		Node(int result, Node *left = nullptr, Node *right = nullptr) : result(result), left(left), right(right) {}
	};

private:
	Node *root;
	queue<Node *> queueTime;
	friend class resGojo;

public:
	treeBST(Node *root = nullptr) : root(root) {}
	~treeBST()
	{
		destroyTree(root);
	}

	void destroyTree(Node *node)
	{
		if (node != nullptr)
		{
			destroyTree(node->left);
			destroyTree(node->right);
			delete node;
		}
	}

	int size()
	{
		return queueTime.size();
	}

	Node *addNodeRecursive(Node *node, int result)
	{
		if (node == nullptr)
		{
			Node *temp = new Node(result);
			this->queueTime.push(temp);
			return temp;
		}

		if (result < node->result)
			node->left = addNodeRecursive(node->left, result);
		else
			node->right = addNodeRecursive(node->right, result);

		return node;
	}

	void addNode(int result)
	{
		root = addNodeRecursive(root, result);
	}

	Node *parentMinResultNode(Node *node)
	{
		Node *parent = nullptr;
		Node *current = node;

		while (current->left != nullptr)
		{
			parent = current;
			current = current->left;
		}

		if (parent == nullptr)
			return node;
		else
			return parent;
	}

	Node *removeRecur(Node *node, Node *removeNode)
	{
		if (node == nullptr || removeNode == nullptr)
			return node;

		if (removeNode->result < node->result)
			node->left = removeRecur(node->left, removeNode);
		else if (removeNode->result > node->result)
			node->right = removeRecur(node->right, removeNode);
		else if (removeNode == node)
		{
			if (node->left == nullptr)
			{
				Node *temp = node->right;

				delete node;
				return temp;
			}
			else if (node->right == nullptr)
			{
				Node *temp = node->left;

				delete node;
				return temp;
			}

			Node *temp = parentMinResultNode(node->right);
			if (temp == node->right)
			{
				if (temp->left)
				{
					Node *minResultNode = temp->left;

					temp->left = minResultNode->right;
					minResultNode->right = node->right;
					minResultNode->left = node->left;

					delete node;
					return minResultNode;
				}
				else
				{
					temp->left = node->left;
					delete node;
					return temp;
				}
			}
			else
			{
				Node *minResultNode = temp->left;

				temp->left = minResultNode->right;
				minResultNode->right = node->right;
				minResultNode->left = node->left;

				delete node;
				return minResultNode;
			}
		}
		return node;
	}

	int countNode(Node *node)
	{
		return (node != nullptr) ? 1 + countNode(node->left) + countNode(node->right) : 0;
	}

	long int pow(long int b, long int exp, long int mod)
	{
		long int ret = 1;

		while (exp > 0)
		{
			if ((exp & 1) > 0)
				ret = (ret * b) % mod;
			b = (b * b) % mod;
			exp >>= 1;
		}

		return ret;
	}

	unsigned long long binomialCoefficient(int n, int r)
	{
		if (r > n)
			return 0;
		if (n - r > r)
			r = n - r;
		int SPF[n + 1];
		for (int i = 1; i <= n; i++)
			SPF[i] = i;
		for (int i = 4; i <= n; i += 2)
			SPF[i] = 2;

		for (int i = 3; i * i < n + 1; i += 2)
		{
			if (SPF[i] == i)
			{
				for (int j = i * i; j < n + 1; j += i)
					if (SPF[j] == j)
					{
						SPF[j] = i;
					}
			}
		}
		map<int, int> prime_pow;
		for (int i = r + 1; i < n + 1; i++)
		{
			int t = i;
			while (t > 1)
			{
				if (!prime_pow[SPF[t]])
				{
					prime_pow[SPF[t]] = 1;
				}
				else
					prime_pow[SPF[t]]++;
				t /= SPF[t];
			}
		}
		for (int i = 1; i < n - r + 1; i++)
		{
			int t = i;
			while (t > 1)
			{
				prime_pow[SPF[t]]--;
				t /= SPF[t];
			}
		}
		long int ans = 1, mod = 1000000007;
		for (auto it : prime_pow)
			ans = (ans * pow(it.first, prime_pow[it.first], mod)) % mod;
		return (int)ans;
	}

	unsigned long long DFS(Node *node)
	{
		if (node == nullptr)
			return 1;
		int left = countNode(node->left);
		int right = countNode(node->right);
		return binomialCoefficient(left + right, left) * DFS(node->right) * DFS(node->left);
	}

	void remove()
	{
		if (this->size() == 0)
			return;

		if (this->size() == 1)
		{
			delete root;
			queueTime.pop();
			root = nullptr;
			return;
		}

		int number = DFS(root) % MAXSIZE;

		for (int i = 0; i < number && !queueTime.empty(); i++)
		{
			Node *temp = queueTime.front();
			queueTime.pop();
			root = removeRecur(root, temp);
		}
	}

	void printInorder(Node *node)
	{
		if (node == nullptr)
			return;

		printInorder(node->left);
		cout << node->result << endl;
		printInorder(node->right);
	}

	void print()
	{
		printInorder(root);
	}
};

class resGojo
{
private:
	unordered_map<int, treeBST *> areaTable;

public:
	resGojo() {}
	~resGojo()
	{
		for (auto &pair : areaTable)
			delete pair.second;
		areaTable.clear();
	}

	void addNodeAreaTable(int result)
	{
		int ID = result % MAXSIZE + 1;

		if (ID < 1 || ID > MAXSIZE)
			return;

		if (areaTable.find(ID) == areaTable.end())
			areaTable[ID] = new treeBST();

		areaTable[ID]->addNode(result);
	}

	void gojoRemove()
	{
		if (areaTable.size() < 1)
			return;
		for (int i = 1; i < MAXSIZE + 1; i++)
		{
			auto it = areaTable.find(i);

			if (it != areaTable.end())
			{
				areaTable[i]->remove();
			}
		}
	}

	void gojoPrintInorder(int number)
	{
		int areaTableSize = areaTable.size();

		if (areaTableSize < 1)
			return;

		if (number <= 0 || number > MAXSIZE)
			return;

		auto it = areaTable.find(number);

		if (it != areaTable.end())
			areaTable[number]->print();
		else
			return;
	}
};

class resSukuna
{
	class Node
	{
	private:
		int ID;
		list<int> head;
		friend class resSukuna;

	public:
		Node(int ID) : ID(ID) {}

		int size() const
		{
			return head.size();
		}

		void insert(int result)
		{
			head.push_front(result);
		}

		void remove(int number)
		{
			for (int i = 0; !head.empty() && i < number; i++)
			{
				cout << head.back() << "-" << ID << endl;
				head.pop_back();
			}
		}

		void print(int number)
		{
			for (list<int>::iterator it = head.begin(); it != head.end() && number > 0; --number, ++it)
				cout << ID << "-" << *it << endl;
		}
	};

private:
	vector<Node *> areaTable;
	list<Node *> listRecentlyUsed;

private:
	int findIndex(Node *node)
	{
		int areaTableSize = areaTable.size();

		for (int i = 0; i < areaTableSize; i++)
		{
			if (areaTable[i] == node)
				return i;
		}
		return -1;
	}

	bool comparelistRecentlyUsed(Node *node1, Node *node2)
	{
		for (Node *x : listRecentlyUsed)
		{
			if (x == node1)
				return true;
			else if (x == node2)
				return false;
		}
		return false;
	}

	void reheapDown(int index)
	{
		int leftChild = 2 * index + 1;
		int rightChild = 2 * index + 2;
		int smallest = index;
		int areaTableSize = areaTable.size();

		if (leftChild < areaTableSize && areaTable[leftChild]->size() < areaTable[smallest]->size())
			smallest = leftChild;
		else if (leftChild < areaTableSize && areaTable[leftChild]->size() == areaTable[smallest]->size() && comparelistRecentlyUsed(areaTable[smallest], areaTable[leftChild]))
			smallest = leftChild;

		if (rightChild < areaTableSize && areaTable[rightChild]->size() < areaTable[smallest]->size())
			smallest = rightChild;
		else if (rightChild < areaTableSize && areaTable[rightChild]->size() == areaTable[smallest]->size() && comparelistRecentlyUsed(areaTable[smallest], areaTable[rightChild]))
			smallest = rightChild;

		if (smallest != index)
		{
			swap(areaTable[index], areaTable[smallest]);
			reheapDown(smallest);
		}
	}

	void reheapUp(int index)
	{
		if (index == 0)
			return;

		int parent = (index - 1) / 2;

		if (areaTable[index]->size() < areaTable[parent]->size())
		{
			swap(areaTable[index], areaTable[parent]);
			reheapUp(parent);
		}
		else if (areaTable[index]->size() == areaTable[parent]->size() && comparelistRecentlyUsed(areaTable[parent], areaTable[index]))
		{
			swap(areaTable[index], areaTable[parent]);
			reheapUp(parent);
		}
	}

	void moveTopLRU(Node *node)
	{
		auto it = find(listRecentlyUsed.begin(), listRecentlyUsed.end(), node);

		if (it != listRecentlyUsed.end())
			listRecentlyUsed.erase(it);
		listRecentlyUsed.push_front(node);
	}

	void removeNode(Node *node)
	{
		auto it = find(listRecentlyUsed.begin(), listRecentlyUsed.end(), node);

		if (it != listRecentlyUsed.end())
			listRecentlyUsed.erase(it);
	}

public:
	resSukuna() {}
	~resSukuna()
	{
		for (auto *node : areaTable)
		{
			delete node;
		}
		areaTable.clear();
		listRecentlyUsed.clear();
	}

	void insertAreaTable(int result)
	{
		int ID = result % MAXSIZE + 1;
		int index = -1;

		int areaTableSize = areaTable.size();

		for (int i = 0; i < areaTableSize; i++)
		{
			if (areaTable[i]->ID == ID)
			{
				index = i;
				break;
			}
		}
		if (index == -1)
		{
			areaTable.push_back(new Node(ID));
			index = areaTable.size() - 1;
			areaTable[index]->insert(result);
			this->moveTopLRU(areaTable[index]);
			this->reheapUp(index);
		}
		else
		{
			areaTable[index]->insert(result);
			this->moveTopLRU(areaTable[index]);
			this->reheapDown(index);
		}
	}

	void sukunaRemove(int number)
	{
		if (areaTable.size() <= 0)
			return;

		list<Node *> clonedList;

		clonedList.assign(areaTable.begin(), areaTable.end());
		clonedList.sort([this](Node *a, Node *b)
						{
				if (a->size() == b->size()) return !comparelistRecentlyUsed(a, b);
				return a->size() < b->size(); });

		int numberRemove = number;

		while (numberRemove != 0 && clonedList.size() != 0)
		{
			Node *nodePtr = clonedList.front();
			int k = findIndex(nodePtr);

			clonedList.pop_front();
			areaTable[k]->remove(number);

			if (areaTable[k]->size() == 0)
			{
				swap(areaTable[k], areaTable[areaTable.size() - 1]);
				this->removeNode(areaTable[areaTable.size() - 1]);
				delete areaTable[areaTable.size() - 1];
				areaTable.pop_back();
			}
			else
				moveTopLRU(areaTable[k]);
			this->reheapDown(k);
			--numberRemove;
		}
		clonedList.clear();
	}

	void printPreOrder(int index, int number)
	{
		int areaTableSize = this->areaTable.size();

		if (index >= areaTableSize)
			return;

		this->areaTable[index]->print(number);

		printPreOrder(index * 2 + 1, number);
		printPreOrder(index * 2 + 2, number);
	}

	void sukunaPrintPreorder(int number)
	{
		printPreOrder(0, number);
	}
};

class restaurant
{
private:
	resGojo *hash;
	resSukuna *heap;
	vector<pair<char, pair<int, int>>> currCustomer;

public:
	restaurant()
	{
		hash = new resGojo();
		heap = new resSukuna();
	};
	~restaurant()
	{
		delete hash;
		delete heap;
	}

	vector<pair<char, pair<int, int>>> frequencySort(string s, string &caesarName)
	{
		unordered_map<char, int> frequency;

		for (char c : s)
		{
			frequency[c]++;
		}

		if (frequency.size() < 3)
		{
			return {{'F', {0, 0}}};
		}

		for (char c : s)
		{
			if (c >= 'a' && c <= 'z')
				c = ((c - 'a' + frequency[c]) % 26 + 'a');
			else if (c >= 'A' && c <= 'Z')
				c = ((c - 'A' + frequency[c]) % 26 + 'A');

			caesarName += c;
		}

		unordered_map<char, int> encodedChars;

		for (auto it = frequency.begin(); it != frequency.end(); ++it)
		{
			int frequencyCount = it->second;
			char encodedChar;

			if (it->first >= 'a' && it->first <= 'z')
			{
				encodedChar = static_cast<char>((it->first - 'a' + frequencyCount) % 26 + 'a');
			}
			else if (it->first >= 'A' && it->first <= 'Z')
			{
				encodedChar = static_cast<char>((it->first - 'A' + frequencyCount) % 26 + 'A');
			}

			encodedChars[encodedChar] += frequencyCount;
		}

		vector<pair<char, int>> vec(encodedChars.begin(), encodedChars.end());

		sort(vec.begin(), vec.end(), [](const pair<char, int> &a, const pair<char, int> &b)
			 {
				if (a.second == b.second) {
					if (islower(a.first) && isupper(b.first)) return true;
					else if (islower(a.first) && islower(b.first)) return a.first < b.first;
					else if (isupper(a.first) && isupper(b.first)) return a.first < b.first;
					else if (islower(b.first) && isupper(a.first)) return false;
				}
				return a.second < b.second; });

		vector<pair<char, pair<int, int>>> result;
		int index = 1;

		for (const auto &pair : vec)
		{
			result.emplace_back(pair.first, make_pair(pair.second, index++));
		}

		frequency.clear();
		encodedChars.clear();
		vec.clear();

		return result;
	}

	void LAPSE(string name)
	{
		string caesarName = "";
		vector<pair<char, pair<int, int>>> result1 = frequencySort(name, caesarName);
		pair<int, int> target = {0, 0};
		char targetChar = 'F';

		if (result1.size() == 1 && result1[0].first == targetChar && result1[0].second == target)
		{
			result1.clear();
			return;
		}

		currCustomer = result1;

		// for (const auto& element : result1) {
		// 	std::cout << "Char: " << element.first << "(Freq: " << element.second.first << ", ONum" << element.second.second << ")" << std::endl;
		// }

		huffTree *huffTemp = new huffTree(result1);
		unordered_map<char, string> getBit;
		string resultBinary = "";

		huffTemp->setCode(huffTemp->getRoot(), "", getBit);

		for (char c : caesarName)
		{
			resultBinary += getBit[c];
		}

		reverse(resultBinary.begin(), resultBinary.end());

		// cout << "Result Binary: " << resultBinary << endl;

		int decimal = 0;
		int length = resultBinary.length();

		if (length > 10)
			length = 10;

		for (int i = 0; i < length; i++)
		{
			if (resultBinary[i] == '1')
				decimal = decimal * 2 + 1;
			else
				decimal = decimal * 2;
		}

		int result = decimal;

		// cout << "Result: " << result << endl;
		// huffTemp->printTreeStructure();

		if (result % 2 == 1)
			hash->addNodeAreaTable(result);
		else
			heap->insertAreaTable(result);

		result1.clear();
		getBit.clear();
		delete huffTemp;
	}

	void KOKUSEN()
	{
		hash->gojoRemove();
	}

	void LIMITLESS(int num)
	{
		hash->gojoPrintInorder(num);
	}

	void KEITEIKEN(int num)
	{
		heap->sukunaRemove(num);
	}

	void CLEAVE(int num)
	{
		heap->sukunaPrintPreorder(num);
	}

	void HAND()
	{
		if (!currCustomer.empty())
		{
			huffTree *huffTemp = new huffTree(currCustomer);
			huffTemp->printHuffTree();
			delete huffTemp;
		}
	}
};

void simulate(string filename)
{
	ifstream ss(filename);
	string str, maxsize, name, num;
	restaurant *r = new restaurant();
	// int i = 1;

	while (ss >> str)
	{
		// cout << "-----------------------" << endl;
		// cout << "Command no. " << i++ << endl;
		if (str == "MAXSIZE")
		{
			ss >> maxsize;
			MAXSIZE = stoi(maxsize);
		}
		else if (str == "LAPSE")
		{ // LAPSE <NAME>
			ss >> name;
			r->LAPSE(name);
		}
		else if (str == "KOKUSEN")
		{ // KOKUSEN
			r->KOKUSEN();
		}
		else if (str == "KEITEIKEN")
		{ // KEITEIKEN <NUM>
			ss >> num;
			r->KEITEIKEN(stoi(num));
		}
		else if (str == "HAND")
		{ // HAND
			r->HAND();
		}
		else if (str == "LIMITLESS")
		{ // LIMITLESS <NUM>
			ss >> num;
			r->LIMITLESS(stoi(num));
		}
		else if (str == "CLEAVE")
		{ // CLEAVE <NUM>
			ss >> num;
			r->CLEAVE(stoi(num));
		}
	}
	// cout << "-----------------------" << endl;
	delete r;
}