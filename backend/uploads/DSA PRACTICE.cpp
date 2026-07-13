//Problem 1
class Solution {
public:
    bool isBalanced(vector<int>& nums) {
        int n = nums.size();
        int even = 0;
        int odd =  0;
        for(int i = 0;i<n;i++){
            if(nums[i]%2==0){
                even++;
            }
            else{
                odd++;
            }
        }
        if(even ==odd){
            return true;
        }
        else{
            return false;
        }

    }
};

//Problem 2

class Solution {
public:
    int maxAdjacentDiff(vector<int>& nums) {
        int n = nums.size();
        int d = 0;
        int maxd = 0;
        for(int i = 0;i<n-1;i++){
            d = abs(nums[i]-nums[i+1]);
            maxd = max(maxd, d);
        }
        return maxd;

    }
};

//Problem 3

class Solution {
public:
    int digitProduct(int n) {
        int rem = 0;
        int prod = 1;
        while(n!=0){
            rem = n%10;
            prod = prod*rem;
            n/=10;
        }
        return prod;

    }
};

//Problem 4
class Solution {
public:
    int firstUnique(string s) {
        int n = s.length();
        unordered_map<char,int>m;
        for(char c :s){
            m[c]++;
        }
        for(auto it:m){
            if(m[c] ==1){
                return it.second;
            }
        }
        return -1;

    }
};

//Problem 5
class Solution {
public:
    bool increasingTriplet(vector<int>& nums) {
        int n = nums.size();
        for(int i = 0;i<n-2;i++){
            if(nums[i]<nums[i+1]<nums[i+2]){
                return true;
            }
        }
        return false;

    }
};

