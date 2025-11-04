import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MyHomePage(title: '교재 실습'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with TickerProviderStateMixin {
  late TabController _tabController;
  bool opacity = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: createBody(),
    );
  }

  @override
  void initState() {
    super.initState();

    _tabController = TabController(length: 3, vsync: this);
  }

  ////////
  ///

  Widget createBody() {
    return Center(child: createS6());
  }

  Widget createS1() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(color: Colors.red, width: 100, height: 40),
        const SizedBox(height: 10),
        Container(color: Colors.blue, width: 100, height: 40),
        const SizedBox(height: 10),
        Container(color: Colors.blue, width: 100, height: 40),
      ],
    );
  }

  Widget createS2() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(color: Colors.red, width: 100, height: 40),
        const SizedBox(width: 10, child: Text('|')),
        Container(color: Colors.blue, width: 100, height: 40),
        const SizedBox(width: 10, child: Text('|')),
        Container(color: Colors.blue, width: 100, height: 40),
      ],
    );
  }

  Widget createS3() {
    return ListView(
      scrollDirection: Axis.vertical,
      children: List.generate(
        10000,
        (index) => Container(
          width: 100,
          height: 100,
          margin: const EdgeInsets.all(5),
          color: Colors.red.withAlpha((index + 1) * 25),
          child: Center(
            child: Text(
              'Item ${index + 1}',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }

  Widget createS4() {
    return PageView(
      scrollDirection: Axis.vertical,
      pageSnapping: false,
      children: [
        Container(
          color: Colors.red,
          child: const Center(
            child: Text(
              "1",
              style: TextStyle(fontSize: 50, color: Colors.white),
            ),
          ),
        ),
        Container(
          color: Colors.blue,
          child: const Center(
            child: Text(
              "2",
              style: TextStyle(fontSize: 50, color: Colors.white),
            ),
          ),
        ),
        Container(
          color: Colors.yellow,
          child: const Center(
            child: Text(
              "3",
              style: TextStyle(fontSize: 50, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget createS5() {
    return Column(
      children: [
        TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: '메뉴1'),
            Tab(text: '메뉴2'),
            Tab(text: '메뉴3'),
          ],
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              Container(
                color: Colors.blue,
                child: Center(child: Text('메뉴1 페이지')),
              ),
              Container(
                color: Colors.green,
                child: Center(child: Text('메뉴2 페이지')),
              ),
              Container(
                color: Colors.red,
                child: Center(child: Text('메뉴3 페이지')),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget createS6() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 500),
          width: opacity ? 100 : 150,
          height: opacity ? 100 : 150,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: opacity ? Colors.red : Colors.blue,
          ),
          onEnd: () {
            print('asdfasdf');
          },
        ),
        Center(
          child: ElevatedButton(
            onPressed: () {
              opacity = !opacity;
              setState(() {});
            },
            child: Text('변경하기'),
          ),
        ),
      ],
    );
  }
}
